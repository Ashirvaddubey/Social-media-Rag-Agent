import type { RAGQuery, RAGResponse, VectorDocument } from "@/lib/types"
import { config } from "@/lib/config"
import { EmbeddingService } from "@/lib/services/embedding-service"
import { VectorStoreService } from "@/lib/services/vector-store-service"
import { DatabaseService } from "@/lib/services/database-service"
import { LLMService } from "@/lib/services/llm-service"

export class RAGService {
  private embeddingService: EmbeddingService
  private vectorStoreService: VectorStoreService
  private databaseService: DatabaseService
  private llmService: LLMService

  constructor() {
    this.embeddingService = new EmbeddingService()
    this.vectorStoreService = new VectorStoreService()
    this.databaseService = new DatabaseService()
    this.llmService = new LLMService()
  }

  async query(query: RAGQuery): Promise<RAGResponse> {
    try {
      console.log(`Processing RAG query: "${query.query}"`)

      // Debug: Check vector store document count
      const docCount = await this.vectorStoreService.getDocumentCount()
      console.log(`Vector store has ${docCount} documents`)

      // Step 1: Generate embedding for the query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query.query)
      console.log(`Generated query embedding with ${queryEmbedding.length} dimensions`)

      // Step 2: Retrieve relevant documents from vector store
      const relevantDocs = await this.vectorStoreService.similaritySearch(
        queryEmbedding,
        query.limit || config.rag.retrieval.topK,
        config.rag.retrieval.similarityThreshold,
        query.filters,
      )

      console.log(`Found ${relevantDocs.length} relevant documents`)

      if (relevantDocs.length === 0) {
        return {
          answer:
            "I couldn't find any relevant information about that topic in the current social media data. Please try a different query or check back later as new data is continuously being ingested.",
          sources: [],
          confidence: 0.1,
        }
      }

      // Step 3: Get full post details for context
      const contextPosts = await Promise.all(
        relevantDocs.map(async (doc) => {
          const post = await this.databaseService.getPostById(doc.metadata.postId)
          return {
            document: doc,
            post,
          }
        }),
      )

      // Step 4: Build context for LLM
      const context = this.buildContext(contextPosts.filter((cp) => cp.post !== null))

      // Step 5: Generate response using LLM
      const response = await this.llmService.generateResponse(query.query, context)

      // Step 6: Calculate confidence based on similarity scores
      const avgSimilarity = relevantDocs.reduce((sum, doc) => sum + doc.similarity, 0) / relevantDocs.length
      const confidence = Math.min(avgSimilarity * 1.2, 1.0) // Boost confidence slightly

      // Step 7: Format sources
      const sources = contextPosts
        .filter((cp) => cp.post !== null)
        .map((cp) => ({
          postId: cp.post!.id,
          platform: cp.post!.platform,
          content: cp.post!.content.slice(0, 200) + (cp.post!.content.length > 200 ? "..." : ""),
          url: cp.post!.url,
          relevanceScore: cp.document.similarity,
        }))

      console.log(`RAG query completed with ${sources.length} sources, confidence: ${confidence.toFixed(2)}`)

      return {
        answer: response,
        sources,
        confidence,
      }
    } catch (error) {
      console.error("RAG query error:", error)
      return {
        answer: "I encountered an error while processing your query. Please try again or rephrase your question.",
        sources: [],
        confidence: 0.0,
      }
    }
  }

  async addDocuments(documents: VectorDocument[]): Promise<void> {
    try {
      console.log(`Adding ${documents.length} documents to RAG system`)

      // Generate embeddings for documents that don't have them
      const documentsWithEmbeddings = await Promise.all(
        documents.map(async (doc) => {
          if (!doc.embedding || doc.embedding.length === 0) {
            const embedding = await this.embeddingService.generateEmbedding(doc.content)
            return { ...doc, embedding }
          }
          return doc
        }),
      )

      // Store in vector database
      await this.vectorStoreService.addDocuments(documentsWithEmbeddings)

      console.log(`Successfully added ${documentsWithEmbeddings.length} documents to vector store`)
    } catch (error) {
      console.error("Error adding documents to RAG system:", error)
      throw error
    }
  }

  async indexPosts(): Promise<void> {
    try {
      console.log("Starting to index posts for RAG system...")

      // Get all posts from database
      const posts = await this.databaseService.getPosts({ limit: 1000 })
      console.log(`Found ${posts.length} posts in database`)

      // Convert posts to vector documents
      const documents: VectorDocument[] = []

      for (const post of posts) {
        // Chunk the post content if it's too long
        const chunks = this.chunkContent(post.content)
        console.log(`Post ${post.id}: ${chunks.length} chunks`)

        for (let i = 0; i < chunks.length; i++) {
          const doc: VectorDocument = {
            id: `${post.id}_chunk_${i}`,
            content: chunks[i],
            metadata: {
              postId: post.id,
              platform: post.platform,
              timestamp: post.timestamp,
              author: post.author,
              url: post.url,
              hashtags: post.hashtags,
              sentiment: post.sentiment || 0.5,
            },
            embedding: [], // Will be generated in addDocuments
          }
          documents.push(doc)
        }
      }

      console.log(`Created ${documents.length} vector documents`)

      // Add documents to RAG system
      await this.addDocuments(documents)

      console.log(`Indexing completed: ${documents.length} document chunks from ${posts.length} posts`)
    } catch (error) {
      console.error("Error indexing posts:", error)
      throw error
    }
  }

  private buildContext(contextPosts: Array<{ document: VectorDocument; post: any }>): string {
    const contextParts = contextPosts.map((cp, index) => {
      const post = cp.post
      const doc = cp.document

      return `[Source ${index + 1}] Platform: ${post.platform.toUpperCase()}
Author: ${post.author}
Timestamp: ${post.timestamp.toISOString()}
Content: ${doc.content}
Hashtags: ${post.hashtags.join(", ")}
Sentiment: ${post.sentiment ? (post.sentiment * 100).toFixed(0) + "% positive" : "neutral"}
URL: ${post.url}
---`
    })

    return contextParts.join("\n\n")
  }

  private chunkContent(content: string): string[] {
    const maxChunkSize = config.rag.embedding.chunkSize
    const overlap = config.rag.embedding.chunkOverlap

    if (content.length <= maxChunkSize) {
      return [content]
    }

    const chunks: string[] = []
    let start = 0

    while (start < content.length) {
      let end = start + maxChunkSize

      // Try to break at word boundary
      if (end < content.length) {
        const lastSpace = content.lastIndexOf(" ", end)
        if (lastSpace > start + maxChunkSize * 0.5) {
          end = lastSpace
        }
      }

      chunks.push(content.slice(start, end).trim())
      start = end - overlap
    }

    return chunks.filter((chunk) => chunk.length > 0)
  }

  // Utility method to get system statistics
  async getStats(): Promise<{
    totalDocuments: number
    totalPosts: number
    lastIndexed: string
  }> {
    try {
      const totalDocuments = await this.vectorStoreService.getDocumentCount()
      const totalPosts = await this.databaseService.getTotalPostsCount()

      return {
        totalDocuments,
        totalPosts,
        lastIndexed: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error getting RAG stats:", error)
      return {
        totalDocuments: 0,
        totalPosts: 0,
        lastIndexed: "Error",
      }
    }
  }
}

import type { VectorDocument } from "@/lib/types"
import { EmbeddingService } from "@/lib/services/embedding-service"
import { config } from "@/lib/config" // Fixed import path to use correct config location

interface SearchResult {
  document: VectorDocument
  similarity: number
}

interface SearchFilters {
  platform?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  sentiment?: {
    min: number
    max: number
  }
  keywords?: string[]
}

export class VectorStoreService {
  private static instance: VectorStoreService
  private documents!: Map<string, VectorDocument>
  private embeddingService!: EmbeddingService
  private chromaClient: any = null
  private collection: any = null
  private isChromaAvailable: boolean = false

  constructor() {
    if (VectorStoreService.instance) {
      return VectorStoreService.instance
    }
    
    this.documents = new Map()
    this.embeddingService = new EmbeddingService()
    this.initializeChromaDB()
    
    VectorStoreService.instance = this
  }

  async addDocuments(documents: VectorDocument[]): Promise<void> {
    console.log(`Adding ${documents.length} documents to vector store`)

    if (this.isChromaAvailable) {
      await this.addDocumentsToChroma(documents)
    } else {
      await this.addDocumentsToMemory(documents)
    }
  }

  private async addDocumentsToChroma(documents: VectorDocument[]): Promise<void> {
    try {
      const collectionName = config.rag.vectorStore.collection
      
      for (const doc of documents) {
        if (!doc.embedding || doc.embedding.length === 0) {
          doc.embedding = await this.embeddingService.generateEmbedding(doc.content)
        }

        // Add to ChromaDB
        const response = await fetch(`http://${config.env.chromaHost}:${config.env.chromaPort}/api/v1/collections/${collectionName}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: [doc.id],
            documents: [doc.content],
            embeddings: [doc.embedding],
            metadatas: [doc.metadata]
          })
        })

        if (!response.ok) {
          throw new Error(`Failed to add document to ChromaDB: ${response.status}`)
        }
      }

      console.log(`✅ Added ${documents.length} documents to ChromaDB`)
    } catch (error) {
      console.error("Error adding documents to ChromaDB:", error)
      // Fallback to in-memory storage
      await this.addDocumentsToMemory(documents)
    }
  }

  private async addDocumentsToMemory(documents: VectorDocument[]): Promise<void> {
    for (const doc of documents) {
      if (!doc.embedding || doc.embedding.length === 0) {
        doc.embedding = await this.embeddingService.generateEmbedding(doc.content)
      }
      this.documents.set(doc.id, doc)
    }

    console.log(`📝 Using in-memory storage: ${this.documents.size} documents`)
  }

  async similaritySearch(
    queryEmbedding: number[],
    topK = 5,
    threshold = 0.7,
    filters?: SearchFilters,
  ): Promise<Array<VectorDocument & { similarity: number }>> {
    console.log(`Performing similarity search with topK=${topK}, threshold=${threshold}`)

    if (this.isChromaAvailable) {
      return this.similaritySearchChroma(queryEmbedding, topK, threshold, filters)
    } else {
      return this.similaritySearchMemory(queryEmbedding, topK, threshold, filters)
    }
  }

  private async similaritySearchChroma(
    queryEmbedding: number[],
    topK: number,
    threshold: number,
    filters?: SearchFilters,
  ): Promise<Array<VectorDocument & { similarity: number }>> {
    try {
      const collectionName = config.rag.vectorStore.collection
      
      // Build filter query for ChromaDB
      const whereClause = this.buildChromaFilter(filters)
      
      const response = await fetch(`http://${config.env.chromaHost}:${config.env.chromaPort}/api/v1/collections/${collectionName}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query_embeddings: [queryEmbedding],
          n_results: topK,
          where: whereClause
        })
      })

      if (!response.ok) {
        throw new Error(`ChromaDB query failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Transform ChromaDB response to our format
      const results: Array<VectorDocument & { similarity: number }> = []
      
      if (data.ids && data.ids[0]) {
        for (let i = 0; i < data.ids[0].length; i++) {
          const id = data.ids[0][i]
          const content = data.documents[0][i]
          const metadata = data.metadatas[0][i]
          const distance = data.distances[0][i]
          
          // Convert distance to similarity (ChromaDB uses distance, we want similarity)
          const similarity = 1 - (distance / Math.sqrt(queryEmbedding.length))
          
          if (similarity >= threshold) {
            results.push({
              id,
              content,
              metadata,
              embedding: queryEmbedding, // We don't have the original embedding
              similarity
            })
          }
        }
      }

      console.log(`✅ ChromaDB search found ${results.length} relevant documents`)
      return results
    } catch (error) {
      console.error("Error searching ChromaDB:", error)
      // Fallback to in-memory search
      return this.similaritySearchMemory(queryEmbedding, topK, threshold, filters)
    }
  }

  private async similaritySearchMemory(
    queryEmbedding: number[],
    topK: number,
    threshold: number,
    filters?: SearchFilters,
  ): Promise<Array<VectorDocument & { similarity: number }>> {
    // In-memory search
    const results: SearchResult[] = []

    for (const doc of this.documents.values()) {
      if (!this.passesFilters(doc, filters)) {
        continue
      }

      const similarity = EmbeddingService.cosineSimilarity(queryEmbedding, doc.embedding)

      if (similarity >= threshold) {
        results.push({
          document: doc,
          similarity,
        })
      }
    }

    results.sort((a, b) => b.similarity - a.similarity)
    const topResults = results.slice(0, topK)

    console.log(`📝 In-memory search found ${topResults.length} relevant documents`)

    return topResults.map((result) => ({
      ...result.document,
      similarity: result.similarity,
    }))
  }

  private buildChromaFilter(filters?: SearchFilters): any {
    if (!filters) return {}
    
    const whereClause: any = {}
    
    if (filters.platform && filters.platform.length > 0) {
      whereClause.platform = { $in: filters.platform }
    }
    
    if (filters.dateRange) {
      whereClause.timestamp = {
        $gte: filters.dateRange.start.toISOString(),
        $lte: filters.dateRange.end.toISOString()
      }
    }
    
    if (filters.sentiment) {
      whereClause.sentiment = {
        $gte: filters.sentiment.min,
        $lte: filters.sentiment.max
      }
    }
    
    return whereClause
  }



  async getDocumentById(id: string): Promise<VectorDocument | null> {
    return this.documents.get(id) || null
  }

  async getDocumentCount(): Promise<number> {
    if (this.isChromaAvailable) {
      try {
        const collectionName = config.rag.vectorStore.collection
        const response = await fetch(`http://${config.env.chromaHost}:${config.env.chromaPort}/api/v1/collections/${collectionName}/count`)
        
        if (response.ok) {
          const data = await response.json()
          return data.count || 0
        }
      } catch (error) {
        console.error("Error getting ChromaDB document count:", error)
      }
    }
    
    return this.documents.size
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id)
  }

  async clearAll(): Promise<void> {
    this.documents.clear()
    console.log("Vector store cleared")
  }

  private async initializeChromaDB(): Promise<void> {
    try {
      // Try to connect to ChromaDB server
      const chromaUrl = `http://${config.env.chromaHost}:${config.env.chromaPort}`
      
      // Test connection
      const response = await fetch(`${chromaUrl}/api/v1/heartbeat`)
      if (response.ok) {
        this.isChromaAvailable = true
        console.log(`✅ Connected to ChromaDB at ${chromaUrl}`)
        
        // Initialize ChromaDB client
        await this.setupChromaCollection()
      } else {
        throw new Error(`ChromaDB connection failed: ${response.status}`)
      }
    } catch (error) {
      console.warn("⚠️ ChromaDB not available, using in-memory storage:", error)
      this.isChromaAvailable = false
    }
  }

  private async setupChromaCollection(): Promise<void> {
    try {
      // Create or get collection
      const collectionName = config.rag.vectorStore.collection
      const response = await fetch(`http://${config.env.chromaHost}:${config.env.chromaPort}/api/v1/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: collectionName,
          metadata: { description: "Social media posts for RAG system" }
        })
      })

      if (response.status === 409) {
        // Collection already exists
        console.log(`📝 Using existing ChromaDB collection: ${collectionName}`)
      } else if (response.ok) {
        console.log(`📝 Created new ChromaDB collection: ${collectionName}`)
      } else {
        throw new Error(`Failed to create ChromaDB collection: ${response.status}`)
      }
    } catch (error) {
      console.error("Error setting up ChromaDB collection:", error)
      this.isChromaAvailable = false
    }
  }

  private passesFilters(doc: VectorDocument, filters?: SearchFilters): boolean {
    if (!filters) return true

    if (filters.platform && !filters.platform.includes(doc.metadata.platform)) {
      return false
    }

    if (filters.dateRange) {
      const docDate = new Date(doc.metadata.timestamp)
      if (docDate < filters.dateRange.start || docDate > filters.dateRange.end) {
        return false
      }
    }

    if (filters.sentiment) {
      const sentiment = doc.metadata.sentiment
      if (sentiment < filters.sentiment.min || sentiment > filters.sentiment.max) {
        return false
      }
    }

    if (filters.keywords && filters.keywords.length > 0) {
      const contentLower = doc.content.toLowerCase()
      const hasKeyword = filters.keywords.some((keyword) => contentLower.includes(keyword.toLowerCase()))
      if (!hasKeyword) {
        return false
      }
    }

    return true
  }

  getStats(): {
    totalDocuments: number
    platformBreakdown: Record<string, number>
    avgSentiment: number
  } {
    const docs = Array.from(this.documents.values())
    const platformBreakdown: Record<string, number> = {}
    let totalSentiment = 0

    for (const doc of docs) {
      const platform = doc.metadata.platform
      platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1
      totalSentiment += doc.metadata.sentiment
    }

    return {
      totalDocuments: docs.length,
      platformBreakdown,
      avgSentiment: docs.length > 0 ? totalSentiment / docs.length : 0,
    }
  }
}

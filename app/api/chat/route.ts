import { type NextRequest, NextResponse } from "next/server"
import { RAGService } from "@/lib/services/rag-service"
import { DatabaseService } from "@/lib/services/database-service"
import { demoSocialMediaPosts } from "@/lib/demo/demo-data"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    // Initialize services
    const ragService = new RAGService()
    const databaseService = new DatabaseService()

    // Check if we have posts in the database (including MongoDB)
    const posts = await databaseService.getPosts()
    const postCount = posts.length
    
    if (postCount === 0) {
      console.log("No data found, loading demo data...")
      await databaseService.storePosts(demoSocialMediaPosts)
      await ragService.indexPosts()
    } else {
      // We have real data, ensure it's indexed for RAG
      console.log(`Found ${postCount} posts, ensuring RAG indexing...`)
      const ragStats = await ragService.getStats()
      
      if (ragStats.totalDocuments === 0) {
        console.log("Posts exist but not indexed, indexing now...")
        await ragService.indexPosts()
      }
    }

    // Process the query through RAG pipeline
    const response = await ragService.query({
      query: message,
      limit: 5,
    })

    return NextResponse.json({
      response: response.answer,
      sources: response.sources,
      confidence: response.confidence,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

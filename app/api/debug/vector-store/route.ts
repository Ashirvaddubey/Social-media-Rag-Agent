import { NextResponse } from "next/server"
import { VectorStoreService } from "@/lib/services/vector-store-service"
import { DatabaseService } from "@/lib/services/database-service"
import { RAGService } from "@/lib/services/rag-service"

export async function GET() {
  try {
    const vectorStore = new VectorStoreService()
    const database = new DatabaseService()
    const ragService = new RAGService()

    // Get various stats
    const vectorDocCount = await vectorStore.getDocumentCount()
    const dbPostCount = await database.getTotalPostsCount()
    const posts = await database.getPosts({ limit: 10 })
    const ragStats = await ragService.getStats()

    return NextResponse.json({
      vectorStore: {
        documentCount: vectorDocCount,
      },
      database: {
        postCount: dbPostCount,
        samplePosts: posts.map(p => ({
          id: p.id,
          platform: p.platform,
          content: p.content.substring(0, 100) + "...",
          hashtags: p.hashtags,
        })),
      },
      rag: ragStats,
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      { error: "Failed to get debug info", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

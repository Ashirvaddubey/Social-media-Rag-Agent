import { NextResponse } from "next/server"
import { RAGService } from "@/lib/services/rag-service"

export async function GET() {
  try {
    const ragService = new RAGService()
    const stats = await ragService.getStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("RAG stats error:", error)
    return NextResponse.json(
      {
        totalDocuments: 0,
        totalPosts: 0,
        lastIndexed: "Error",
      },
      { status: 500 },
    )
  }
}

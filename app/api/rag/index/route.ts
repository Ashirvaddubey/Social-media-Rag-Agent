import { NextResponse } from "next/server"
import { RAGService } from "@/lib/services/rag-service"

export async function POST() {
  try {
    const ragService = new RAGService()
    await ragService.indexPosts()

    return NextResponse.json({
      success: true,
      message: "Posts successfully indexed for RAG system",
    })
  } catch (error) {
    console.error("RAG indexing error:", error)
    return NextResponse.json(
      {
        error: "Failed to index posts for RAG system",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

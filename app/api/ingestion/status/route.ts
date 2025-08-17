import { NextResponse } from "next/server"
import { IngestionService } from "@/lib/services/ingestion-service"

export async function GET() {
  try {
    const ingestionService = new IngestionService()
    const status = await ingestionService.getStatus()

    return NextResponse.json(status)
  } catch (error) {
    console.error("Status API error:", error)
    return NextResponse.json(
      {
        hackernews: "error",
        rss: "error",
        reddit: "error",
        youtube: "error",
        lastUpdate: "Error",
        totalPosts: 0,
        errors: ["Failed to fetch status"],
      },
      { status: 500 },
    )
  }
}

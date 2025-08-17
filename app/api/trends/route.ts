import { NextResponse } from "next/server"
import { TrendAnalysisService } from "@/lib/services/trend-analysis-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const trendService = new TrendAnalysisService()
    const trends = await trendService.getTrendingTopics(limit)

    return NextResponse.json(trends)
  } catch (error) {
    console.error("Trends API error:", error)
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 })
  }
}

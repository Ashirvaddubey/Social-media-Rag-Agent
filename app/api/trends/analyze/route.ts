import { NextResponse } from "next/server"
import { TrendAnalysisService } from "@/lib/services/trend-analysis-service"

export async function POST() {
  try {
    const trendService = new TrendAnalysisService()
    const result = await trendService.analyzeTrends()

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Trend analysis API error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze trends",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

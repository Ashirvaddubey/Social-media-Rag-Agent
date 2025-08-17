import { NextResponse } from "next/server"
import { TrendAnalysisService } from "@/lib/services/trend-analysis-service"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const trendService = new TrendAnalysisService()
    const trendDetails = await trendService.getTrendDetails(params.id)

    if (!trendDetails.trend) {
      return NextResponse.json({ error: "Trend not found" }, { status: 404 })
    }

    return NextResponse.json(trendDetails)
  } catch (error) {
    console.error("Trend details API error:", error)
    return NextResponse.json({ error: "Failed to fetch trend details" }, { status: 500 })
  }
}

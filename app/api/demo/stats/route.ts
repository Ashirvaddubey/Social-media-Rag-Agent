import { NextResponse } from "next/server"
import { DemoService } from "@/lib/demo/demo-service"

export async function GET() {
  try {
    const demoService = new DemoService()
    const stats = await demoService.getDemoStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Demo stats error:", error)
    return NextResponse.json(
      {
        posts: 0,
        trends: 0,
        ragDocuments: 0,
        platforms: [],
        categories: [],
      },
      { status: 500 },
    )
  }
}

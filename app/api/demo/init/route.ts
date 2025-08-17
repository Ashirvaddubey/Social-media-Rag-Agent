import { NextResponse } from "next/server"
import { DemoService } from "@/lib/demo/demo-service"

export async function POST() {
  try {
    const demoService = new DemoService()
    await demoService.initializeDemo()

    return NextResponse.json({
      success: true,
      message: "Demo data initialized successfully",
    })
  } catch (error) {
    console.error("Demo initialization error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize demo data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { IngestionService } from "@/lib/services/ingestion-service"

export async function POST() {
  try {
    const ingestionService = new IngestionService()
    await ingestionService.triggerIngestion()

    return NextResponse.json({ success: true, message: "Ingestion triggered successfully" })
  } catch (error) {
    console.error("Trigger API error:", error)
    return NextResponse.json({ error: "Failed to trigger ingestion" }, { status: 500 })
  }
}

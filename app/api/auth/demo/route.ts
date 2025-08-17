import { NextResponse } from "next/server"
import { authService } from "@/lib/services/auth-service"

export async function GET() {
  try {
    const token = await authService.getDemoToken()
    return NextResponse.json({ token })
  } catch (error) {
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 })
  }
}

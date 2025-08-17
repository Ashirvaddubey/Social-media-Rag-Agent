import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/services/auth-service"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("No token provided")
    }

    const token = authHeader.substring(7)
    const user = await authService.verifyToken(token)

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}

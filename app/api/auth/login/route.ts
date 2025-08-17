import { NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "@/lib/config"

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Initialize database service
    const dbService = new DatabaseService()

    // Find user by email
    const user = await dbService.getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

                    // Generate JWT token with proper fallback
                const jwtSecret = config.env.jwtSecret || config.auth.jwtSecret
                if (!jwtSecret) {
                  throw new Error("JWT secret not configured")
                }
                
                const token = jwt.sign(
                  { userId: user.id, email: user.email, role: user.role },
                  jwtSecret,
                  { expiresIn: "7d" }
                )

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}

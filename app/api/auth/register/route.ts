import { NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/services/database-service"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "@/lib/config"

interface RegisterRequest {
  username: string
  email: string
  password: string
}

export async function POST(request: NextRequest) {
                try {
                const { username, email, password }: RegisterRequest = await request.json()



                // Validate input
                if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Initialize database service
    const dbService = new DatabaseService()

    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await dbService.createUser({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: "user"
    })

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
      message: "User registered successfully",
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    )
  }
}

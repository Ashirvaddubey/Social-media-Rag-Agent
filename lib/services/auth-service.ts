import jwt from "jsonwebtoken"
import { config } from "@/lib/config"

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  createdAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

class AuthService {
  private users: Map<string, User & { password: string }> = new Map()

  constructor() {
    // Initialize with demo user
    this.users.set("demo@socialrag.com", {
      id: "1",
      username: "Demo User",
      email: "demo@socialrag.com",
      password: "demo123",
      role: "admin",
      createdAt: new Date(),
    })
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = this.users.get(credentials.email)

    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid credentials")
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.auth.jwtSecret,
      { expiresIn: config.auth.tokenExpiry },
    )

    const { password, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret) as any
      const user = this.users.get(decoded.email)

      if (!user) {
        throw new Error("User not found")
      }

      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    } catch (error) {
      throw new Error("Invalid token")
    }
  }

  async getDemoToken(): Promise<string> {
    return config.auth.demoCredentials.token
  }
}

export const authService = new AuthService()

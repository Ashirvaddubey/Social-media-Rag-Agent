"use client"

import { useState, useEffect } from "react"
import { TrendDashboard } from "@/components/trend-dashboard"
import { ChatInterface } from "@/components/chat-interface"
import { DataIngestionStatus } from "@/components/data-ingestion-status"
import { SystemHealth } from "@/components/system-health"
import { DemoBanner } from "@/components/demo-banner"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Prevent hydration mismatch by not rendering until client-side
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const { user } = await response.json()
        setUser(user)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem("auth_token")
      }
    } catch (error) {
      // Silently handle auth errors - this is expected for demo mode
      localStorage.removeItem("auth_token")
      console.log("Auth verification failed, using demo mode")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("auth_token")
    const savedUser = localStorage.getItem("user")
    
    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setUser(user)
        setIsAuthenticated(true)
        setLoading(false)
      } catch (error) {
        // If user data is corrupted, verify token
        verifyToken(token)
      }
    } else if (token) {
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  if (!mounted) {
    return null
  }

  const handleLogin = (user: any, token: string) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    setIsAuthenticated(false)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Social Media RAG...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">SR</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Social Media RAG
                </h1>
                <p className="text-gray-600 mt-1">AI-powered trend analysis with real-time insights</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SystemHealth />
              <DataIngestionStatus />
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.username || "Demo User"}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <DemoBanner />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <TrendDashboard />
          </div>

          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 Social Media RAG. Built with Next.js, React, and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

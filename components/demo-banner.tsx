"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Play, BarChart3, X, Database, Zap } from "lucide-react"

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const initializeDemo = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch("/api/demo/init", { method: "POST" })
      if (response.ok) {
        setIsInitialized(true)
        // Auto-hide banner after successful initialization
        setTimeout(() => setIsVisible(false), 5000)
      }
    } catch (error) {
      console.error("Failed to initialize demo:", error)
    } finally {
      setIsInitializing(false)
    }
  }

  if (!isVisible) return null

  return (
    <Alert className="border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-800 mb-6 shadow-lg">
      <Rocket className="h-5 w-5 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <strong className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Social Media RAG Demo!
            </strong>
            <p className="text-sm mt-2 text-gray-700">
              {isInitialized
                ? "🎉 Demo data loaded successfully! Explore trending topics, analyze sentiment, and try the AI-powered chat interface."
                : "🚀 Click 'Initialize Demo' to load sample data from Reddit, YouTube, and other platforms to start exploring the system."}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                <Database className="h-3 w-3 mr-1" />
                MongoDB + ChromaDB
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                <Zap className="h-3 w-3 mr-1" />
                Real APIs
              </Badge>
            </div>
          </div>
          {isInitialized && (
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                <BarChart3 className="h-3 w-3 mr-1" />
                System Ready
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isInitialized && (
            <Button
              size="sm"
              onClick={initializeDemo}
              disabled={isInitializing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Play className="h-4 w-4 mr-1" />
              {isInitializing ? "Initializing..." : "Initialize Demo"}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="hover:bg-white/50">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X, Zap, TrendingUp } from "lucide-react"

interface Update {
  id: string
  type: "trend" | "ingestion" | "rag" | "alert"
  message: string
  timestamp: Date
  severity: "info" | "warning" | "success"
}

export function RealTimeUpdates() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const mockUpdates: Update[] = [
        {
          id: Date.now().toString(),
          type: "trend",
          message: "New trending topic detected: 'AI Revolution' with 234% growth",
          timestamp: new Date(),
          severity: "success",
        },
        {
          id: (Date.now() + 1).toString(),
          type: "ingestion",
          message: "Successfully ingested 1,247 new posts from HackerNews",
          timestamp: new Date(),
          severity: "info",
        },
        {
          id: (Date.now() + 2).toString(),
          type: "rag",
          message: "RAG system indexed 3,456 new documents",
          timestamp: new Date(),
          severity: "info",
        },
      ]

      // Randomly add updates
      if (Math.random() > 0.7) {
        const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)]
        setUpdates((prev) => [randomUpdate, ...prev.slice(0, 4)]) // Keep only 5 most recent
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-4 w-4" />
      case "rag":
        return <Zap className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getUpdateColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800"
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  if (!isVisible || updates.length === 0) {
    return null
  }

  return (
    <Alert className={`${getUpdateColor(updates[0]?.severity || "info")} relative`}>
      <div className="flex items-center gap-2">
        {getUpdateIcon(updates[0]?.type || "info")}
        <AlertDescription className="flex-1">
          <div className="flex items-center justify-between">
            <span>{updates[0]?.message}</span>
            <div className="flex items-center gap-2">
              {updates.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  +{updates.length - 1} more
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </AlertDescription>
      </div>
    </Alert>
  )
}

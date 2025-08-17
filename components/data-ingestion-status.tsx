"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database } from "lucide-react"

interface IngestionStatus {
  hackernews: "active" | "inactive" | "error"
  rss: "active" | "inactive" | "error"
  reddit: "active" | "inactive" | "error"
  youtube: "active" | "inactive" | "error"
  lastUpdate: string
}

export function DataIngestionStatus() {
  const [status, setStatus] = useState<IngestionStatus>({
    hackernews: "inactive",
    rss: "inactive",
    reddit: "inactive",
    youtube: "inactive",
    lastUpdate: "Never",
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/ingestion/status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch ingestion status:", error)
    }
  }

  const triggerIngestion = async () => {
    setIsRefreshing(true)
    try {
      await fetch("/api/ingestion/trigger", { method: "POST" })
      await fetchStatus()
    } catch (error) {
      console.error("Failed to trigger ingestion:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1">
          <Badge variant="outline" className="text-xs">
            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(status.hackernews)}`} />
            HackerNews
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(status.reddit)}`} />
            Reddit
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(status.rss)}`} />
            RSS
          </Badge>
          <Badge variant="outline" className="text-xs">
            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(status.youtube)}`} />
            YouTube
          </Badge>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">Last: {status.lastUpdate}</div>

      <Button variant="outline" size="sm" onClick={triggerIngestion} disabled={isRefreshing}>
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}

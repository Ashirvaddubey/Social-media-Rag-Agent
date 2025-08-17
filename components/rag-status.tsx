"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, RefreshCw, Zap } from "lucide-react"

interface RAGStats {
  totalDocuments: number
  totalPosts: number
  lastIndexed: string
}

export function RAGStatus() {
  const [stats, setStats] = useState<RAGStats>({
    totalDocuments: 0,
    totalPosts: 0,
    lastIndexed: "Never",
  })
  const [isIndexing, setIsIndexing] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/rag/stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch RAG stats:", error)
    }
  }

  const triggerIndexing = async () => {
    setIsIndexing(true)
    try {
      const response = await fetch("/api/rag/index", { method: "POST" })
      if (response.ok) {
        await fetchStats()
      }
    } catch (error) {
      console.error("Failed to trigger indexing:", error)
    } finally {
      setIsIndexing(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          RAG System Status
        </CardTitle>
        <CardDescription>Vector embeddings and retrieval system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalDocuments.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Vector Documents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalPosts.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Source Posts</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Last Indexed:</span>
            <Badge variant="outline">{stats.lastIndexed}</Badge>
          </div>

          <Button variant="outline" size="sm" onClick={triggerIndexing} disabled={isIndexing}>
            <RefreshCw className={`h-4 w-4 ${isIndexing ? "animate-spin" : ""}`} />
            {isIndexing ? "Indexing..." : "Re-index"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, Target, Database } from "lucide-react"

interface RAGMetrics {
  avgResponseTime: number
  queryAccuracy: number
  indexingSpeed: number
  vectorSimilarity: number
  totalQueries: number
  successRate: number
}

export function RAGPerformance() {
  const [metrics, setMetrics] = useState<RAGMetrics>({
    avgResponseTime: 1.2,
    queryAccuracy: 87,
    indexingSpeed: 95,
    vectorSimilarity: 0.82,
    totalQueries: 1247,
    successRate: 94,
  })

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        avgResponseTime: prev.avgResponseTime + (Math.random() - 0.5) * 0.1,
        queryAccuracy: Math.max(80, Math.min(95, prev.queryAccuracy + (Math.random() - 0.5) * 2)),
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 5),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          RAG Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metrics.totalQueries.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Queries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metrics.avgResponseTime.toFixed(1)}s</div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Query Accuracy</span>
            </div>
            <Badge variant="outline">{metrics.queryAccuracy}%</Badge>
          </div>
          <Progress value={metrics.queryAccuracy} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Indexing Speed</span>
            </div>
            <Badge variant="outline">{metrics.indexingSpeed}%</Badge>
          </div>
          <Progress value={metrics.indexingSpeed} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Success Rate</span>
            </div>
            <Badge variant="outline">{metrics.successRate}%</Badge>
          </div>
          <Progress value={metrics.successRate} className="h-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Vector Similarity</span>
            </div>
            <Badge variant="outline">{(metrics.vectorSimilarity * 100).toFixed(0)}%</Badge>
          </div>
          <Progress value={metrics.vectorSimilarity * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

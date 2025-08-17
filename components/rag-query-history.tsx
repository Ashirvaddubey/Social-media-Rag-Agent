"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, MessageSquare, CheckCircle, XCircle } from "lucide-react"

interface QueryRecord {
  id: string
  query: string
  timestamp: Date
  responseTime: number
  confidence: number
  status: "success" | "error"
  sourcesFound: number
}

export function RAGQueryHistory() {
  const [queries, setQueries] = useState<QueryRecord[]>([
    {
      id: "1",
      query: "What are people saying about AI trends?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      responseTime: 1.2,
      confidence: 0.87,
      status: "success",
      sourcesFound: 5,
    },
    {
      id: "2",
      query: "Climate change sentiment analysis",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      responseTime: 0.9,
      confidence: 0.92,
      status: "success",
      sourcesFound: 8,
    },
    {
      id: "3",
      query: "Cryptocurrency market discussion",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      responseTime: 2.1,
      confidence: 0.65,
      status: "success",
      sourcesFound: 3,
    },
    {
      id: "4",
      query: "Sports trending topics",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      responseTime: 0.0,
      confidence: 0.0,
      status: "error",
      sourcesFound: 0,
    },
  ])

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return "text-green-600"
    if (confidence > 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent RAG Queries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {queries.map((query) => (
              <div key={query.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {query.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1 truncate">{query.query}</div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(query.timestamp)}
                    </div>
                    {query.status === "success" && (
                      <>
                        <span>{query.responseTime.toFixed(1)}s</span>
                        <span>{query.sourcesFound} sources</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {query.status === "success" ? (
                    <Badge variant="outline" className={getConfidenceColor(query.confidence)}>
                      {(query.confidence * 100).toFixed(0)}%
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Error</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

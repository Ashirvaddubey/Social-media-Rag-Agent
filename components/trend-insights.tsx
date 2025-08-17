"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Heart, Globe } from "lucide-react"

interface TrendInsights {
  totalTrends: number
  fastestGrowing: string
  mostDiscussed: string
  sentimentLeader: string
  crossPlatformTrends: string[]
}

export function TrendInsights() {
  const [insights, setInsights] = useState<TrendInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchInsights = async () => {
    try {
      // This would come from the trend analysis API
      // For now, using mock data
      setInsights({
        totalTrends: 42,
        fastestGrowing: "AI Revolution",
        mostDiscussed: "Climate Change",
        sentimentLeader: "New iPhone",
        crossPlatformTrends: ["AI", "Sustainability", "Remote Work", "Crypto", "Health Tech"],
      })
    } catch (error) {
      console.error("Failed to fetch insights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
    const interval = setInterval(fetchInsights, 10 * 60 * 1000) // Refresh every 10 minutes
    return () => clearInterval(interval)
  }, [])

  if (isLoading || !insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Insights</CardTitle>
          <CardDescription>Loading insights...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Insights</CardTitle>
        <CardDescription>Key patterns and highlights from current trends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{insights.totalTrends}</div>
            <div className="text-sm text-muted-foreground">Active Trends</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{insights.crossPlatformTrends.length}</div>
            <div className="text-sm text-muted-foreground">Cross-Platform</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium">Fastest Growing</div>
              <div className="text-sm text-muted-foreground">{insights.fastestGrowing}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium">Most Discussed</div>
              <div className="text-sm text-muted-foreground">{insights.mostDiscussed}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium">Sentiment Leader</div>
              <div className="text-sm text-muted-foreground">{insights.sentimentLeader}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium mb-2">Cross-Platform Trends</div>
              <div className="flex flex-wrap gap-1">
                {insights.crossPlatformTrends.map((trend) => (
                  <Badge key={trend} variant="secondary" className="text-xs">
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

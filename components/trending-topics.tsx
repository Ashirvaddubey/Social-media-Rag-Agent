"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Hash, RefreshCw, BarChart3, Sparkles } from "lucide-react"
import type { TrendingTopic } from "@/lib/types"

interface TrendingTopicsProps {
  detailed?: boolean
}

export function TrendingTopics({ detailed = false }: TrendingTopicsProps) {
  const [trends, setTrends] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const fetchTrends = async () => {
    try {
      const response = await fetch(`/api/trends?limit=${detailed ? 20 : 10}`)
      const data = await response.json()
      setTrends(data)
    } catch (error) {
      console.error("Failed to fetch trends:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/trends/analyze", { method: "POST" })
      if (response.ok) {
        await fetchTrends()
      }
    } catch (error) {
      console.error("Failed to trigger analysis:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    fetchTrends()
    const interval = setInterval(fetchTrends, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [detailed])

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "platform-twitter text-white"
      case "reddit":
        return "platform-reddit text-white"
      case "youtube":
        return "platform-youtube text-white"
      case "all":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.6) return "text-emerald-600 bg-emerald-50 border-emerald-200"
    if (sentiment > 0.4) return "text-amber-600 bg-amber-50 border-amber-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
      Politics: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      Entertainment: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
      Sports: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      Business: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white",
      Science: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
      Environment: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
      Other: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
    }
    return colors[category] || colors.Other
  }

  if (isLoading) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Hash className="h-4 w-4 text-white" />
            </div>
            <span className="gradient-text">Trending Topics</span>
          </CardTitle>
          <CardDescription>Loading trending topics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center animate-glow">
                <Hash className="h-4 w-4 text-white" />
              </div>
              <span className="gradient-text text-2xl">Trending Topics</span>
            </CardTitle>
            <CardDescription className="text-lg">Most discussed topics across platforms</CardDescription>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerAnalysis}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              <BarChart3 className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTrends}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {trends.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-float">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 gradient-text">No trending topics found</h3>
            <p className="text-muted-foreground mb-4">Try running the trend analysis to discover current trends</p>
            <Button
              onClick={triggerAnalysis}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {trends.map((trend, index) => (
              <div
                key={trend.id}
                className="group relative p-4 border-2 border-transparent bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea, #764ba2) border-box`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className={`w-4 h-4 rounded-full ${getPlatformColor(trend.platform)} shadow-lg`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold text-lg gradient-text">{trend.keyword}</div>
                        <Badge className={`${getCategoryColor(trend.category)} shadow-md border-0`}>
                          {trend.category}
                        </Badge>
                      </div>
                      {detailed && (
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {trend.mentions.toLocaleString()} mentions
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {trend.relatedPosts.length} posts
                          </span>
                          {trend.platform !== "all" && (
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              {trend.platform}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={`${getSentimentColor(trend.sentiment)} border shadow-md px-3 py-1`}>
                      {(trend.sentiment * 100).toFixed(0)}%
                    </Badge>
                    <div className="flex items-center gap-2 text-sm min-w-[80px] justify-end">
                      <div className={`p-1 rounded-full ${trend.change > 0 ? "bg-green-100" : "bg-red-100"}`}>
                        {trend.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <span className={`font-semibold ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}>
                        {Math.abs(trend.change).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

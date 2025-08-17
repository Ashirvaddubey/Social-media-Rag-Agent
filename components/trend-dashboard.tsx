"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendChart } from "@/components/trend-chart"
import { TrendingTopics } from "@/components/trending-topics"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { PlatformMetrics } from "@/components/platform-metrics"
import { TrendInsights } from "@/components/trend-insights"
import { RAGStatus } from "@/components/rag-status"
import { RealTimeUpdates } from "@/components/real-time-updates"
import { TrendCategories } from "@/components/trend-categories"
import { SentimentTrends } from "@/components/sentiment-trends"
import { SentimentByPlatform } from "@/components/sentiment-by-platform"
import { PlatformComparison } from "@/components/platform-comparison"
import { RAGPerformance } from "@/components/rag-performance"
import { RAGQueryHistory } from "@/components/rag-query-history"

export function TrendDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <RealTimeUpdates />

        <Card className="glass-effect border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
              </div>
              Social Media Trend Analysis Dashboard
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              AI-powered insights from Twitter, Reddit, and YouTube with real-time RAG analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl h-14">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="trends"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Trends
                </TabsTrigger>
                <TabsTrigger
                  value="sentiment"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Sentiment
                </TabsTrigger>
                <TabsTrigger
                  value="platforms"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Platforms
                </TabsTrigger>
                <TabsTrigger
                  value="rag"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  RAG System
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <TrendChart />
                  </div>
                  <div>
                    <TrendInsights />
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <TrendingTopics />
                  <SentimentAnalysis />
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <TrendingTopics detailed />
                  </div>
                  <div className="space-y-6">
                    <TrendInsights />
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                      <CardHeader>
                        <CardTitle className="text-xl gradient-text">Trend Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TrendCategories />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SentimentAnalysis />
                  <SentimentTrends />
                </div>
                <SentimentByPlatform />
              </TabsContent>

              <TabsContent value="platforms" className="space-y-6">
                <PlatformMetrics />
                <PlatformComparison />
              </TabsContent>

              <TabsContent value="rag" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RAGStatus />
                  <RAGPerformance />
                </div>
                <RAGQueryHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

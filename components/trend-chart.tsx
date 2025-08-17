"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"

interface TrendData {
  time: string
  mentions: number
  sentiment: number
  twitter: number
  reddit: number
  youtube: number
}

export function TrendChart() {
  const [data, setData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTrendData = async () => {
    try {
      // Mock data - in production, this would come from the trend analysis API
      const mockData: TrendData[] = [
        { time: "00:00", mentions: 120, sentiment: 0.6, twitter: 60, reddit: 35, youtube: 25 },
        { time: "04:00", mentions: 89, sentiment: 0.4, twitter: 45, reddit: 28, youtube: 16 },
        { time: "08:00", mentions: 234, sentiment: 0.8, twitter: 120, reddit: 67, youtube: 47 },
        { time: "12:00", mentions: 456, sentiment: 0.7, twitter: 200, reddit: 156, youtube: 100 },
        { time: "16:00", mentions: 678, sentiment: 0.5, twitter: 300, reddit: 234, youtube: 144 },
        { time: "20:00", mentions: 543, sentiment: 0.9, twitter: 250, reddit: 178, youtube: 115 },
      ]
      setData(mockData)
    } catch (error) {
      console.error("Failed to fetch trend data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendData()
    const interval = setInterval(fetchTrendData, 5 * 60 * 1000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trend Activity</CardTitle>
          <CardDescription>Loading trend data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Activity</CardTitle>
        <CardDescription>Mentions and sentiment over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            mentions: {
              label: "Total Mentions",
              color: "hsl(var(--chart-1))",
            },
            sentiment: {
              label: "Sentiment Score",
              color: "hsl(var(--chart-2))",
            },
            twitter: {
              label: "Twitter",
              color: "hsl(var(--chart-3))",
            },
            reddit: {
              label: "Reddit",
              color: "hsl(var(--chart-4))",
            },
            youtube: {
              label: "YouTube",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="twitter"
                stackId="1"
                stroke="var(--color-twitter)"
                fill="var(--color-twitter)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="reddit"
                stackId="1"
                stroke="var(--color-reddit)"
                fill="var(--color-reddit)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="youtube"
                stackId="1"
                stroke="var(--color-youtube)"
                fill="var(--color-youtube)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

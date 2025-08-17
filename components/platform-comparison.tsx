"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

const platformComparisonData = [
  { metric: "Volume", hackernews: 85, reddit: 65, youtube: 45, rss: 70 },
  { metric: "Engagement", hackernews: 78, reddit: 82, youtube: 90, rss: 65 },
  { metric: "Sentiment", hackernews: 75, reddit: 45, youtube: 82, rss: 70 },
  { metric: "Growth", hackernews: 65, reddit: 70, youtube: 88, rss: 75 },
  { metric: "Reach", hackernews: 95, reddit: 60, youtube: 85, rss: 80 },
  { metric: "Influence", hackernews: 88, reddit: 75, youtube: 70, rss: 85 },
]

export function PlatformComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            hackernews: {
              label: "HackerNews",
              color: "hsl(var(--chart-1))",
            },
            reddit: {
              label: "Reddit",
              color: "hsl(var(--chart-2))",
            },
            youtube: {
              label: "YouTube",
              color: "hsl(var(--chart-3))",
            },
            rss: {
              label: "RSS",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={platformComparisonData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                name="HackerNews"
                dataKey="hackernews"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Reddit"
                dataKey="reddit"
                stroke="var(--color-reddit)"
                fill="var(--color-reddit)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="YouTube"
                dataKey="youtube"
                stroke="hsl(var(--chart-3))"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="RSS"
                dataKey="rss"
                stroke="hsl(var(--chart-4))"
                fill="hsl(var(--chart-4))"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

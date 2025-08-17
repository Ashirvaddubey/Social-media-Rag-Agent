"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const platformSentimentData = [
  { platform: "HackerNews", positive: 75, negative: 15, neutral: 10 },
  { platform: "RSS", positive: 58, negative: 22, neutral: 20 },
  { platform: "Reddit", positive: 45, negative: 35, neutral: 20 },
  { platform: "YouTube", positive: 82, negative: 8, neutral: 10 },
]

export function SentimentByPlatform() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment by Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            positive: {
              label: "Positive",
              color: "hsl(var(--chart-1))",
            },
            negative: {
              label: "Negative",
              color: "hsl(var(--chart-2))",
            },
            neutral: {
              label: "Neutral",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformSentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="positive" stackId="a" fill="var(--color-positive)" />
              <Bar dataKey="neutral" stackId="a" fill="var(--color-neutral)" />
              <Bar dataKey="negative" stackId="a" fill="var(--color-negative)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

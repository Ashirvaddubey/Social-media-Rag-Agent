"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const sentimentTrendData = [
  { time: "6h ago", positive: 65, negative: 20, neutral: 15 },
  { time: "5h ago", positive: 70, negative: 18, neutral: 12 },
  { time: "4h ago", positive: 68, negative: 22, neutral: 10 },
  { time: "3h ago", positive: 72, negative: 16, neutral: 12 },
  { time: "2h ago", positive: 75, negative: 15, neutral: 10 },
  { time: "1h ago", positive: 78, negative: 12, neutral: 10 },
  { time: "Now", positive: 80, negative: 10, neutral: 10 },
]

export function SentimentTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trends</CardTitle>
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
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="positive" stroke="var(--color-positive)" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="var(--color-negative)" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="var(--color-neutral)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

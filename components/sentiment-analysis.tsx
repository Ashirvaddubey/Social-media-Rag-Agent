"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Mock sentiment data
const sentimentData = [
  { topic: "AI Technology", positive: 75, negative: 15, neutral: 10 },
  { topic: "Climate Change", positive: 25, negative: 60, neutral: 15 },
  { topic: "New iPhone", positive: 65, negative: 20, neutral: 15 },
  { topic: "Cryptocurrency", positive: 45, negative: 35, neutral: 20 },
]

export function SentimentAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
        <CardDescription>Emotional tone analysis across trending topics</CardDescription>
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
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
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

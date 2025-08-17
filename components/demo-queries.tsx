"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles } from "lucide-react"

const demoQueries = [
  "What are people saying about AI trends?",
  "How do people feel about climate change?",
  "What's trending in technology?",
  "Analyze sentiment around the new iPhone",
  "What are the cross-platform trending topics?",
]

interface DemoQueriesProps {
  onQuerySelect: (query: string) => void
}

export function DemoQueries({ onQuerySelect }: DemoQueriesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Try These Demo Queries
        </CardTitle>
        <CardDescription>Click any query to test the RAG system with sample data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {demoQueries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start text-left h-auto p-3 bg-transparent hover:bg-muted/50 transition-colors"
              onClick={() => onQuerySelect(query)}
            >
              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm break-words">{query}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

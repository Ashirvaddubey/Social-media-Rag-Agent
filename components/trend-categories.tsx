"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const categoryData = [
  { name: "Technology", count: 15, percentage: 35, color: "bg-blue-500" },
  { name: "Politics", count: 8, percentage: 19, color: "bg-red-500" },
  { name: "Entertainment", count: 7, percentage: 16, color: "bg-purple-500" },
  { name: "Sports", count: 6, percentage: 14, color: "bg-green-500" },
  { name: "Business", count: 4, percentage: 9, color: "bg-yellow-500" },
  { name: "Science", count: 3, percentage: 7, color: "bg-indigo-500" },
]

export function TrendCategories() {
  return (
    <div className="space-y-3">
      {categoryData.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
              <span className="font-medium">{category.name}</span>
            </div>
            <Badge variant="outline">{category.count}</Badge>
          </div>
          <Progress value={category.percentage} className="h-2" />
        </div>
      ))}
    </div>
  )
}

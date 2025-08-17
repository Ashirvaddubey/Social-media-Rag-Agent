"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Youtube, TrendingUp, Users, Heart, Rss } from "lucide-react"

const platformData = [
  {
    name: "HackerNews",
    icon: MessageSquare,
    posts: 45230,
    engagement: 78,
    sentiment: 0.65,
    color: "text-orange-500",
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    darkBgGradient: "from-orange-900 to-orange-800",
  },
  {
    name: "RSS",
    icon: Rss,
    posts: 34560,
    engagement: 72,
    sentiment: 0.58,
    color: "text-purple-500",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    darkBgGradient: "from-purple-900 to-purple-800",
  },
  {
    name: "Reddit",
    icon: MessageSquare,
    posts: 23450,
    engagement: 65,
    sentiment: 0.45,
    color: "text-orange-500",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-100",
    darkBgGradient: "from-orange-900 to-red-800",
  },
  {
    name: "YouTube",
    icon: Youtube,
    posts: 12340,
    engagement: 82,
    sentiment: 0.72,
    color: "text-red-500",
    gradient: "from-red-500 to-red-600",
    bgGradient: "from-red-50 to-red-100",
    darkBgGradient: "from-red-900 to-red-800",
  },
]

export function PlatformMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {platformData.map((platform) => (
        <Card
          key={platform.name}
          className={`shadow-xl border-0 bg-gradient-to-br ${platform.bgGradient} dark:${platform.darkBgGradient} hover:scale-105 transition-all duration-300 group`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-bold">{platform.name}</CardTitle>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${platform.gradient} shadow-lg group-hover:animate-pulse`}>
              <platform.icon className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text">{platform.posts.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground font-medium">Posts analyzed</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Engagement</span>
                  </div>
                  <span className="font-bold text-lg">{platform.engagement}%</span>
                </div>
                <div className="relative">
                  <Progress value={platform.engagement} className="h-3 bg-white/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">Sentiment</span>
                  </div>
                  <span className="font-bold text-lg">{(platform.sentiment * 100).toFixed(0)}%</span>
                </div>
                <div className="relative">
                  <Progress value={platform.sentiment * 100} className="h-3 bg-white/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import type { SocialMediaPost } from "@/lib/types"
import { config } from "@/lib/config"

interface YouTubeVideo {
  id: string
  snippet: {
    title: string
    description: string
    channelTitle: string
    publishedAt: string
    tags?: string[]
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export class YouTubeClient {
  private apiKey: string
  private baseUrl: string
  private rateLimitTracker: Map<string, { count: number; resetTime: number }>

  constructor() {
    this.apiKey = config.env.youtubeApiKey
    this.baseUrl = config.apis.youtube.baseUrl
    this.rateLimitTracker = new Map()
  }

  async getTrendingVideos(category: string, maxResults = 25): Promise<SocialMediaPost[]> {
    if (!this.apiKey) {
      console.warn("YouTube API key not configured, using mock data")
      return this.getMockVideos(category, maxResults)
    }

    try {
      await this.checkRateLimit("videos")

      // First, get trending videos
      const trendingResponse = await fetch(
        `${this.baseUrl}/videos?part=snippet,statistics&chart=mostPopular&maxResults=${Math.min(maxResults, 50)}&key=${this.apiKey}`,
      )

      if (!trendingResponse.ok) {
        throw new Error(`YouTube API error: ${trendingResponse.status} ${trendingResponse.statusText}`)
      }

      const trendingData = await trendingResponse.json()

      // Filter by category if needed (simplified approach)
      let videos = trendingData.items || []
      if (category !== "All") {
        videos = videos.filter(
          (video: YouTubeVideo) =>
            video.snippet.title.toLowerCase().includes(category.toLowerCase()) ||
            video.snippet.description.toLowerCase().includes(category.toLowerCase()),
        )
      }

      return this.transformVideos(videos.slice(0, maxResults))
    } catch (error) {
      console.error("YouTube API error:", error)
      // Fallback to mock data on error
      return this.getMockVideos(category, maxResults)
    }
  }

  private async checkRateLimit(endpoint: string): Promise<void> {
    const now = Date.now()
    const tracker = this.rateLimitTracker.get(endpoint)

    if (!tracker || now > tracker.resetTime) {
      this.rateLimitTracker.set(endpoint, {
        count: 1,
        resetTime: now + config.apis.youtube.rateLimit.window,
      })
      return
    }

    if (tracker.count >= config.apis.youtube.rateLimit.requests) {
      const waitTime = tracker.resetTime - now
      console.log(`Rate limit reached for ${endpoint}, waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      this.rateLimitTracker.set(endpoint, {
        count: 1,
        resetTime: now + config.apis.youtube.rateLimit.window,
      })
    } else {
      tracker.count++
    }
  }

  private transformVideos(videos: YouTubeVideo[]): SocialMediaPost[] {
    return videos.map((video) => ({
      id: video.id,
      platform: "youtube" as const,
      content: `${video.snippet.title}\n\n${video.snippet.description.slice(0, 500)}${video.snippet.description.length > 500 ? "..." : ""}`,
      author: video.snippet.channelTitle,
      timestamp: new Date(video.snippet.publishedAt),
      url: `https://youtube.com/watch?v=${video.id}`,
      metrics: {
        likes: Number.parseInt(video.statistics.likeCount || "0"),
        shares: 0, // YouTube doesn't provide share count in basic API
        comments: Number.parseInt(video.statistics.commentCount || "0"),
        views: Number.parseInt(video.statistics.viewCount || "0"),
      },
      hashtags: video.snippet.tags?.map((tag) => tag.toLowerCase()) || [],
      mentions: [],
    }))
  }

  private getMockVideos(category: string, maxResults: number): SocialMediaPost[] {
    const mockVideos: SocialMediaPost[] = [
      {
        id: "mock-yt-1",
        platform: "youtube",
        content: `${category} Revolution: The Future is Here!\n\nIn this video, we explore the latest developments in ${category.toLowerCase()} and what it means for the future. Don't miss these incredible insights!`,
        author: "TechVisionChannel",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        url: "https://youtube.com/watch?v=mock-yt-1",
        metrics: { likes: 15420, shares: 0, comments: 1247, views: 234567 },
        hashtags: [category.toLowerCase(), "future", "innovation"],
        mentions: [],
      },
      {
        id: "mock-yt-2",
        platform: "youtube",
        content: `Breaking Down the ${category} Trend: What You Need to Know\n\nEveryone's talking about this, but what does it really mean? Let's dive deep into the facts and separate hype from reality.`,
        author: "AnalysisHub",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        url: "https://youtube.com/watch?v=mock-yt-2",
        metrics: { likes: 8934, shares: 0, comments: 567, views: 123456 },
        hashtags: [category.toLowerCase(), "analysis", "explained"],
        mentions: [],
      },
      {
        id: "mock-yt-3",
        platform: "youtube",
        content: `My Honest Opinion on ${category}\n\nAfter weeks of research, here's what I really think about this trending topic. You might be surprised by my conclusions!`,
        author: "HonestReviewer",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        url: "https://youtube.com/watch?v=mock-yt-3",
        metrics: { likes: 5678, shares: 0, comments: 234, views: 87654 },
        hashtags: [category.toLowerCase(), "review", "opinion"],
        mentions: [],
      },
    ]

    return mockVideos.slice(0, Math.min(maxResults, mockVideos.length))
  }
}

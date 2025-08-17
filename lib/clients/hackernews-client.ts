import type { SocialMediaPost } from "@/lib/types"

interface HackerNewsItem {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
  descendants: number
  type: "story" | "comment" | "poll" | "pollopt"
  kids?: number[]
}

export class HackerNewsClient {
  private baseUrl: string
  private rateLimitTracker: Map<string, { count: number; resetTime: number }>

  constructor() {
    this.baseUrl = "https://hacker-news.firebaseio.com/v0"
    this.rateLimitTracker = new Map()
  }

  async getTopStories(limit = 100): Promise<SocialMediaPost[]> {
    try {
      await this.checkRateLimit("topstories")

      const response = await fetch(`${this.baseUrl}/topstories.json`)
      if (!response.ok) {
        throw new Error(`Hacker News API error: ${response.status} ${response.statusText}`)
      }

      const storyIds: number[] = await response.json()
      const limitedIds = storyIds.slice(0, limit)
      
      const stories = await Promise.all(
        limitedIds.map(id => this.getItem(id))
      )

      return stories
        .filter(story => story && story.type === "story")
        .map(story => this.transformStory(story as HackerNewsItem))
    } catch (error) {
      console.error("Hacker News API error:", error)
      return this.getMockStories(limit)
    }
  }

  async getNewStories(limit = 100): Promise<SocialMediaPost[]> {
    try {
      await this.checkRateLimit("newstories")

      const response = await fetch(`${this.baseUrl}/newstories.json`)
      if (!response.ok) {
        throw new Error(`Hacker News API error: ${response.status} ${response.statusText}`)
      }

      const storyIds: number[] = await response.json()
      const limitedIds = storyIds.slice(0, limit)
      
      const stories = await Promise.all(
        limitedIds.map(id => this.getItem(id))
      )

      return stories
        .filter(story => story && story.type === "story")
        .map(story => this.transformStory(story as HackerNewsItem))
    } catch (error) {
      console.error("Hacker News API error:", error)
      return this.getMockStories(limit)
    }
  }

  async searchStories(query: string, limit = 100): Promise<SocialMediaPost[]> {
    try {
      await this.checkRateLimit("search")

      // Hacker News doesn't have a search API, so we'll get top stories and filter
      const stories = await this.getTopStories(limit * 2)
      
      return stories
        .filter(story => 
          story.content.toLowerCase().includes(query.toLowerCase()) ||
          story.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, limit)
    } catch (error) {
      console.error("Hacker News search error:", error)
      return this.getMockStories(limit)
    }
  }

  private async getItem(id: number): Promise<HackerNewsItem | null> {
    try {
      const response = await fetch(`${this.baseUrl}/item/${id}.json`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error(`Error fetching item ${id}:`, error)
      return null
    }
  }

  private transformStory(story: HackerNewsItem): SocialMediaPost {
    return {
      id: story.id.toString(),
      platform: "hackernews",
      content: story.title,
      author: story.by,
      timestamp: new Date(story.time * 1000),
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      metrics: {
        likes: story.score,
        shares: 0, // HN doesn't have shares
        comments: story.descendants,
        views: story.score * 10, // Estimate views based on score
      },
      hashtags: this.extractHashtags(story.title),
      mentions: [],
    }
  }

  private extractHashtags(title: string): string[] {
    // Extract common tech terms as hashtags
    const techTerms = [
      "AI", "ML", "JavaScript", "Python", "React", "Vue", "Angular",
      "Node.js", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
      "Blockchain", "Cryptocurrency", "Web3", "API", "Database",
      "Security", "Privacy", "Open Source", "Startup", "Venture Capital"
    ]
    
    return techTerms.filter(term => 
      title.toLowerCase().includes(term.toLowerCase())
    )
  }

  private async checkRateLimit(endpoint: string): Promise<void> {
    const now = Date.now()
    const tracker = this.rateLimitTracker.get(endpoint)

    if (!tracker || now > tracker.resetTime) {
      this.rateLimitTracker.set(endpoint, {
        count: 1,
        resetTime: now + 60 * 1000, // 1 minute window
      })
      return
    }

    if (tracker.count >= 100) { // HN allows 100 requests per minute
      const waitTime = tracker.resetTime - now
      console.log(`Rate limit reached for ${endpoint}, waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      this.rateLimitTracker.set(endpoint, {
        count: 1,
        resetTime: now + 60 * 1000,
      })
    } else {
      tracker.count++
    }
  }

  private getMockStories(limit: number): SocialMediaPost[] {
    const mockStories: SocialMediaPost[] = [
      {
        id: "mock-hn-1",
        platform: "hackernews",
        content: "Show HN: I built an AI-powered social media trend analyzer using RAG",
        author: "tech_builder",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        url: "https://news.ycombinator.com/item?id=mock-hn-1",
        metrics: { likes: 156, shares: 0, comments: 23, views: 1560 },
        hashtags: ["AI", "RAG", "Show HN"],
        mentions: [],
      },
      {
        id: "mock-hn-2",
        platform: "hackernews",
        content: "The future of vector databases: ChromaDB vs Pinecone vs Weaviate",
        author: "db_expert",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        url: "https://news.ycombinator.com/item?id=mock-hn-2",
        metrics: { likes: 89, shares: 0, comments: 45, views: 890 },
        hashtags: ["Vector Database", "ChromaDB", "Pinecone"],
        mentions: [],
      },
      {
        id: "mock-hn-3",
        platform: "hackernews",
        content: "How we scaled our Next.js app to handle 1M+ daily users",
        author: "scaling_guru",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        url: "https://news.ycombinator.com/item?id=mock-hn-3",
        metrics: { likes: 234, shares: 0, comments: 67, views: 2340 },
        hashtags: ["Next.js", "Scaling", "Performance"],
        mentions: [],
      },
    ]

    return mockStories.slice(0, Math.min(limit, mockStories.length))
  }
}

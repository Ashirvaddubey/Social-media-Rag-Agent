import type { SocialMediaPost } from "@/lib/types"
import { config } from "@/lib/config"

interface RedditPost {
  id: string
  title: string
  selftext: string
  author: string
  created_utc: number
  permalink: string
  score: number
  num_comments: number
  ups: number
  downs: number
  subreddit: string
}

export class RedditClient {
  private clientId: string
  private clientSecret: string
  private userAgent: string
  private baseUrl: string
  private accessToken: string | null = null
  private rateLimitTracker: Map<string, { count: number; resetTime: number }>

  constructor() {
    this.clientId = config.env.redditClientId
    this.clientSecret = config.env.redditClientSecret
    this.userAgent = config.env.redditUserAgent
    this.baseUrl = config.apis.reddit.baseUrl
    this.rateLimitTracker = new Map()
  }

  async getTopPosts(subreddit: string, maxResults = 50): Promise<SocialMediaPost[]> {
    if (!this.clientId || !this.clientSecret) {
      console.warn("Reddit credentials not configured, using mock data")
      return this.getMockPosts(subreddit, maxResults)
    }

    try {
      await this.ensureAuthenticated()
      await this.checkRateLimit("posts")

      const response = await fetch(`${this.baseUrl}/r/${subreddit}/hot.json?limit=${Math.min(maxResults, 100)}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "User-Agent": this.userAgent,
        },
      })

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformPosts(data.data.children.map((child: any) => child.data))
    } catch (error) {
      console.error("Reddit API error:", error)
      // Fallback to mock data on error
      return this.getMockPosts(subreddit, maxResults)
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (this.accessToken) return

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")

    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      throw new Error(`Reddit auth error: ${response.status}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
  }

  private async checkRateLimit(endpoint: string): Promise<void> {
    const now = Date.now()
    const tracker = this.rateLimitTracker.get(endpoint)

    if (!tracker || now > tracker.resetTime) {
      this.rateLimitTracker.set(endpoint, {
        count: 1,
        resetTime: now + config.apis.reddit.rateLimit.window,
      })
      return
    }

    if (tracker.count >= config.apis.reddit.rateLimit.requests) {
      const waitTime = tracker.resetTime - now
      console.log(`Rate limit reached for ${endpoint}, waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      this.rateLimitTracker.set(endpoint, {
        count: 1,
        resetTime: now + config.apis.reddit.rateLimit.window,
      })
    } else {
      tracker.count++
    }
  }

  private transformPosts(posts: RedditPost[]): SocialMediaPost[] {
    return posts.map((post) => ({
      id: post.id,
      platform: "reddit" as const,
      content: post.title + (post.selftext ? `\n\n${post.selftext}` : ""),
      author: post.author,
      timestamp: new Date(post.created_utc * 1000),
      url: `https://reddit.com${post.permalink}`,
      metrics: {
        likes: post.ups,
        shares: 0, // Reddit doesn't have shares
        comments: post.num_comments,
      },
      hashtags: this.extractHashtags(post.title + " " + post.selftext),
      mentions: this.extractMentions(post.title + " " + post.selftext),
    }))
  }

  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#\w+/g) || []
    return hashtags.map((tag) => tag.slice(1).toLowerCase())
  }

  private extractMentions(text: string): string[] {
    const mentions = text.match(/u\/\w+/g) || []
    return mentions.map((mention) => mention.slice(2))
  }

  private getMockPosts(subreddit: string, maxResults: number): SocialMediaPost[] {
    const mockPosts: SocialMediaPost[] = [
      {
        id: "mock-reddit-1",
        platform: "reddit",
        content: `Amazing breakthrough in technology! This could revolutionize how we think about innovation. What do you all think about this development?`,
        author: "tech_guru_2024",
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        url: `https://reddit.com/r/${subreddit}/comments/mock-reddit-1`,
        metrics: { likes: 1247, shares: 0, comments: 156 },
        hashtags: ["technology", "innovation"],
        mentions: [],
      },
      {
        id: "mock-reddit-2",
        platform: "reddit",
        content: `ELI5: Why is everyone talking about this new trend? I've been seeing it everywhere but don't understand the hype.`,
        author: "curious_redditor",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        url: `https://reddit.com/r/${subreddit}/comments/mock-reddit-2`,
        metrics: { likes: 567, shares: 0, comments: 89 },
        hashtags: ["eli5", "question"],
        mentions: [],
      },
      {
        id: "mock-reddit-3",
        platform: "reddit",
        content: `Unpopular opinion: This trending topic is overrated. Here's my detailed analysis of why I think the community is missing the bigger picture...`,
        author: "contrarian_view",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        url: `https://reddit.com/r/${subreddit}/comments/mock-reddit-3`,
        metrics: { likes: 234, shares: 0, comments: 67 },
        hashtags: ["unpopularopinion", "analysis"],
        mentions: [],
      },
    ]

    return mockPosts.slice(0, Math.min(maxResults, mockPosts.length))
  }
}

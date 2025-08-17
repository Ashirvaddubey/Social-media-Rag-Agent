import type { SocialMediaPost } from "@/lib/types"
import { parseString } from "xml2js"

interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  author?: string
  category?: string[]
  guid?: string
}

interface RSSFeed {
  title: string
  link: string
  description: string
  items: RSSItem[]
}

export class RSSClient {
  private feeds: Map<string, string>
  private rateLimitTracker: Map<string, { count: number; resetTime: number }>

  constructor() {
    this.feeds = new Map([
      // Tech News
      ["techcrunch", "https://techcrunch.com/feed/"],
      ["theverge", "https://www.theverge.com/rss/index.xml"],
      ["wired", "https://www.wired.com/feed/rss"],
      ["ars-technica", "https://feeds.arstechnica.com/arstechnica/index"],
      
      // General News
      ["reuters-tech", "https://feeds.reuters.com/reuters/technologyNews"],
      ["bbc-tech", "https://feeds.bbci.co.uk/news/technology/rss.xml"],
      ["cnn-tech", "http://rss.cnn.com/rss/edition_technology.rss"],
      
      // Developer News
      ["dev-to", "https://dev.to/feed"],
      ["hashnode", "https://hashnode.com/n/rss"],
      ["medium-tech", "https://medium.com/feed/tag/technology"],
      
      // Social Media News
      ["social-media-today", "https://www.socialmediatoday.com/feed/"],
      ["social-media-examiner", "https://www.socialmediaexaminer.com/feed/"],
      
      // AI/ML News
      ["ai-news", "https://artificialintelligence-news.com/feed/"],
      ["machine-learning-mastery", "https://machinelearningmastery.com/feed/"],
    ])
    
    this.rateLimitTracker = new Map()
  }

  async getFeedContent(feedName: string, limit = 50): Promise<SocialMediaPost[]> {
    try {
      await this.checkRateLimit(feedName)

      const feedUrl = this.feeds.get(feedName)
      if (!feedUrl) {
        throw new Error(`Unknown feed: ${feedName}`)
      }

      const response = await fetch(feedUrl)
      if (!response.ok) {
        throw new Error(`RSS feed error: ${response.status} ${response.statusText}`)
      }

      const xmlText = await response.text()
      const feed = await this.parseRSS(xmlText)
      
      return feed.items
        .slice(0, limit)
        .map(item => this.transformRSSItem(item, feedName))
    } catch (error) {
      console.error(`RSS feed error for ${feedName}:`, error)
      return this.getMockRSSContent(feedName, limit)
    }
  }

  async getAllFeeds(limit = 25): Promise<SocialMediaPost[]> {
    try {
      const allPosts: SocialMediaPost[] = []
      
      for (const [feedName] of this.feeds) {
        try {
          const posts = await this.getFeedContent(feedName, limit)
          allPosts.push(...posts)
        } catch (error) {
          console.error(`Error fetching ${feedName}:`, error)
          // Continue with other feeds
        }
      }

      // Sort by timestamp and limit total results
      return allPosts
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit * 2)
    } catch (error) {
      console.error("Error fetching all RSS feeds:", error)
      return this.getMockRSSContent("all", limit)
    }
  }

  async searchFeeds(query: string, limit = 50): Promise<SocialMediaPost[]> {
    try {
      const allPosts = await this.getAllFeeds(limit * 2)
      
      return allPosts
        .filter(post => 
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, limit)
    } catch (error) {
      console.error("RSS search error:", error)
      return this.getMockRSSContent("search", limit)
    }
  }

  private parseRSS(xmlText: string): Promise<RSSFeed> {
    return new Promise((resolve, reject) => {
      parseString(xmlText, (err, result) => {
        if (err) {
          console.error("Error parsing RSS feed:", err)
          reject(new Error("Failed to parse RSS feed"))
          return
        }
        
        const channel = result.rss?.channel?.[0]
        if (!channel) {
          reject(new Error("Invalid RSS feed format"))
          return
        }

        const title = channel.title?.[0] || "Unknown Feed"
        const link = channel.link?.[0] || ""
        const description = channel.description?.[0] || ""
        
        const items: RSSItem[] = []
        const itemElements = channel.item
        if (Array.isArray(itemElements)) {
          itemElements.forEach((item: any) => {
            const title = item.title?.[0] || ""
            const link = item.link?.[0] || ""
            const description = item.description?.[0] || ""
            const pubDate = item.pubDate?.[0] || ""
            const author = item.author?.[0] || ""
            const category = Array.isArray(item.category) ? item.category.map((cat: any) => cat?.[0] || "").filter(Boolean) : []
            const guid = item.guid?.[0] || ""

            items.push({
              title,
              link,
              description,
              pubDate,
              author,
              category,
              guid
            })
          })
        }

        const feed: RSSFeed = { title, link, description, items }
        resolve(feed)
      })
    })
  }

  private transformRSSItem(item: RSSItem, feedName: string): SocialMediaPost {
    // Generate a clean ID that MongoDB can handle
    const cleanGuid = item.guid ? item.guid.replace(/[^a-zA-Z0-9_-]/g, '_') : null
    const cleanId = cleanGuid || `rss-${feedName}-${Date.now()}`
    
    return {
      id: cleanId,
      platform: "rss",
      content: item.title,
      author: item.author || feedName,
      timestamp: new Date(item.pubDate),
      url: item.link,
      metrics: {
        likes: 0, // RSS doesn't have likes
        shares: 0, // RSS doesn't have shares
        comments: 0, // RSS doesn't have comments
        views: Math.floor(Math.random() * 1000) + 100, // Estimate views
      },
      hashtags: this.extractHashtags(item.title, item.description, item.category || []),
      mentions: [],
    }
  }

  private extractHashtags(title: string, description: string, categories: string[]): string[] {
    const text = `${title} ${description} ${categories.join(" ")}`.toLowerCase()
    
    const techTerms = [
      "AI", "ML", "Machine Learning", "Artificial Intelligence", "Deep Learning",
      "JavaScript", "Python", "React", "Vue", "Angular", "Node.js", "TypeScript",
      "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Cloud Computing",
      "Blockchain", "Cryptocurrency", "Web3", "NFT", "DeFi",
      "API", "Database", "SQL", "NoSQL", "MongoDB", "PostgreSQL",
      "Security", "Privacy", "Cybersecurity", "Open Source", "GitHub",
      "Startup", "Venture Capital", "Funding", "IPO", "Merger",
      "Social Media", "Marketing", "Digital Marketing", "Content Creation"
    ]
    
    return techTerms.filter(term => text.includes(term.toLowerCase()))
  }

  private async checkRateLimit(feedName: string): Promise<void> {
    const now = Date.now()
    const tracker = this.rateLimitTracker.get(feedName)

    if (!tracker || now > tracker.resetTime) {
      this.rateLimitTracker.set(feedName, {
        count: 1,
        resetTime: now + 60 * 1000, // 1 minute window
      })
      return
    }

    if (tracker.count >= 10) { // Limit to 10 requests per minute per feed
      const waitTime = tracker.resetTime - now
      console.log(`Rate limit reached for ${feedName}, waiting ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      this.rateLimitTracker.set(feedName, {
        count: 1,
        resetTime: now + 60 * 1000,
      })
    } else {
      tracker.count++
    }
  }

  private getMockRSSContent(feedName: string, limit: number): SocialMediaPost[] {
    const mockPosts: SocialMediaPost[] = [
      {
        id: `mock-rss-${feedName}-1`,
        platform: "rss",
        content: "Breaking: Major breakthrough in AI language models - GPT-5 shows unprecedented capabilities",
        author: "tech_reporter",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        url: `https://example.com/rss/${feedName}/1`,
        metrics: { likes: 0, shares: 0, comments: 0, views: 1250 },
        hashtags: ["AI", "GPT-5", "Language Models", "Breakthrough"],
        mentions: [],
      },
      {
        id: `mock-rss-${feedName}-2`,
        platform: "rss",
        content: "The future of social media: How AI is transforming content creation and engagement",
        author: "social_analyst",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        url: `https://example.com/rss/${feedName}/2`,
        metrics: { likes: 0, shares: 0, comments: 0, views: 890 },
        hashtags: ["Social Media", "AI", "Content Creation", "Engagement"],
        mentions: [],
      },
      {
        id: `mock-rss-${feedName}-3`,
        platform: "rss",
        content: "Startup funding roundup: Tech companies raise $2.3B in Q4 2024",
        author: "venture_news",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        url: `https://example.com/rss/${feedName}/3`,
        metrics: { likes: 0, shares: 0, comments: 0, views: 567 },
        hashtags: ["Startup", "Funding", "Venture Capital", "Q4 2024"],
        mentions: [],
      },
    ]

    return mockPosts.slice(0, Math.min(limit, mockPosts.length))
  }
}

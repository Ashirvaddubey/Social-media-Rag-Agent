import type { IngestionStatus, SocialMediaPost } from "@/lib/types"
import { config } from "@/lib/config"
import { HackerNewsClient } from "@/lib/clients/hackernews-client"
import { RSSClient } from "@/lib/clients/rss-client"
import { RedditClient } from "@/lib/clients/reddit-client"
import { YouTubeClient } from "@/lib/clients/youtube-client"
import { DatabaseService } from "@/lib/services/database-service"
import { PreprocessingService } from "@/lib/services/preprocessing-service"

export class IngestionService {
  private hackernewsClient: HackerNewsClient
  private rssClient: RSSClient
  private redditClient: RedditClient
  private youtubeClient: YouTubeClient
  private databaseService: DatabaseService
  private preprocessingService: PreprocessingService
  private status: IngestionStatus

  constructor() {
    this.hackernewsClient = new HackerNewsClient()
    this.rssClient = new RSSClient()
    this.redditClient = new RedditClient()
    this.youtubeClient = new YouTubeClient()
    this.databaseService = new DatabaseService()
    this.preprocessingService = new PreprocessingService()

    this.status = {
      hackernews: "inactive",
      rss: "inactive",
      reddit: "inactive",
      youtube: "inactive",
      lastUpdate: "Never",
      totalPosts: 0,
      errors: [],
    }
  }

  async getStatus(): Promise<IngestionStatus> {
    try {
      // Get total posts from database
      const totalPosts = await this.databaseService.getTotalPostsCount()
      this.status.totalPosts = totalPosts

      // Check if each platform has data and mark as active if they do
      // This is a simple heuristic: if we have posts, assume platforms are working
      if (totalPosts > 0) {
        // Check if we have posts from each platform using existing methods
        const hackerNewsPosts = await this.databaseService.getPosts({ platform: ['hackernews'] })
        const rssPosts = await this.databaseService.getPosts({ platform: ['rss'] })
        const redditPosts = await this.databaseService.getPosts({ platform: ['reddit'] })
        const youtubePosts = await this.databaseService.getPosts({ platform: ['youtube'] })

        this.status.hackernews = hackerNewsPosts.length > 0 ? "active" : "inactive"
        this.status.rss = rssPosts.length > 0 ? "active" : "inactive"
        this.status.reddit = redditPosts.length > 0 ? "active" : "inactive"
        this.status.youtube = youtubePosts.length > 0 ? "active" : "inactive"
        
        // Update last update time if we have data
        if (totalPosts > 0) {
          this.status.lastUpdate = new Date().toISOString()
        }
      }

      return this.status
    } catch (error) {
      console.error("Error getting ingestion status:", error)
      return {
        ...this.status,
        errors: [...this.status.errors, `Status error: ${error instanceof Error ? error.message : "Unknown error"}`],
      }
    }
  }

  async triggerIngestion(): Promise<void> {
    console.log("Starting data ingestion across all platforms...")

    const results = await Promise.allSettled([
      this.ingestHackerNewsData(),
      this.ingestRSSData(),
      this.ingestRedditData(),
      this.ingestYouTubeData(),
    ])

    // Update status based on results
    this.status.hackernews = results[0].status === "fulfilled" ? "active" : "error"
    this.status.rss = results[1].status === "fulfilled" ? "active" : "error"
    this.status.reddit = results[2].status === "fulfilled" ? "active" : "error"
    this.status.youtube = results[3].status === "fulfilled" ? "active" : "error"
    this.status.lastUpdate = new Date().toISOString()

    // Collect any errors
    const errors: string[] = []
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const platform = ["HackerNews", "RSS", "Reddit", "YouTube"][index]
        errors.push(`${platform}: ${result.reason}`)
      }
    })
    this.status.errors = errors

    console.log("Data ingestion completed")
  }

  private async ingestHackerNewsData(): Promise<void> {
    if (!config.ingestion.platforms.hackernews.enabled) {
      throw new Error("HackerNews ingestion is disabled")
    }

    console.log("Ingesting HackerNews data...")

    try {
      const posts: SocialMediaPost[] = []

      for (const query of config.ingestion.platforms.hackernews.queries) {
        const stories = await this.hackernewsClient.searchStories(query, config.ingestion.platforms.hackernews.maxResults)
        posts.push(...stories)
      }

      // Preprocess and store posts
      const processedPosts = await this.preprocessingService.processPosts(posts)
      await this.databaseService.storePosts(processedPosts)

      console.log(`Successfully ingested ${posts.length} HackerNews stories`)
    } catch (error) {
      console.error("HackerNews ingestion error:", error)
      throw new Error(`HackerNews ingestion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async ingestRSSData(): Promise<void> {
    if (!config.ingestion.platforms.rss.enabled) {
      throw new Error("RSS ingestion is disabled")
    }

    console.log("Ingesting RSS data...")

    try {
      const posts: SocialMediaPost[] = []

      for (const feed of config.ingestion.platforms.rss.feeds) {
        const feedPosts = await this.rssClient.getFeedContent(feed, config.ingestion.platforms.rss.maxResults)
        posts.push(...feedPosts)
      }

      // Preprocess and store posts
      const processedPosts = await this.preprocessingService.processPosts(posts)
      await this.databaseService.storePosts(processedPosts)

      console.log(`Successfully ingested ${posts.length} RSS posts`)
    } catch (error) {
      console.error("RSS ingestion error:", error)
      throw new Error(`RSS ingestion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async ingestRedditData(): Promise<void> {
    if (!config.ingestion.platforms.reddit.enabled) {
      throw new Error("Reddit ingestion is disabled")
    }

    console.log("Ingesting Reddit data...")

    try {
      const posts: SocialMediaPost[] = []

      for (const subreddit of config.ingestion.platforms.reddit.subreddits) {
        const redditPosts = await this.redditClient.getTopPosts(subreddit, config.ingestion.platforms.reddit.maxResults)
        posts.push(...redditPosts)
      }

      // Preprocess and store posts
      const processedPosts = await this.preprocessingService.processPosts(posts)
      await this.databaseService.storePosts(processedPosts)

      console.log(`Successfully ingested ${posts.length} Reddit posts`)
    } catch (error) {
      console.error("Reddit ingestion error:", error)
      throw new Error(`Reddit ingestion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private async ingestYouTubeData(): Promise<void> {
    if (!config.ingestion.platforms.youtube.enabled) {
      throw new Error("YouTube ingestion is disabled")
    }

    console.log("Ingesting YouTube data...")

    try {
      const posts: SocialMediaPost[] = []

      for (const category of config.ingestion.platforms.youtube.categories) {
        const videos = await this.youtubeClient.getTrendingVideos(
          category,
          config.ingestion.platforms.youtube.maxResults,
        )
        posts.push(...videos)
      }

      // Preprocess and store posts
      const processedPosts = await this.preprocessingService.processPosts(posts)
      await this.databaseService.storePosts(processedPosts)

      console.log(`Successfully ingested ${posts.length} YouTube videos`)
    } catch (error) {
      console.error("YouTube ingestion error:", error)
      throw new Error(`YouTube ingestion failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async scheduleIngestion(): Promise<void> {
    console.log("Setting up scheduled ingestion...")

    // Set up interval for automatic ingestion
    setInterval(async () => {
      try {
        await this.triggerIngestion()
      } catch (error) {
        console.error("Scheduled ingestion error:", error)
      }
    }, config.ingestion.interval)
  }
}

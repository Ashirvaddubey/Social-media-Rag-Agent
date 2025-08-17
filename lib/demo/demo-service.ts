import { demoSocialMediaPosts, demoTrendingTopics, demoRAGQueries } from "./demo-data"
import { DatabaseService } from "@/lib/services/database-service"
import { RAGService } from "@/lib/services/rag-service"
import { TrendAnalysisService } from "@/lib/services/trend-analysis-service"

export class DemoService {
  private databaseService: DatabaseService
  private ragService: RAGService
  private trendService: TrendAnalysisService

  constructor() {
    this.databaseService = new DatabaseService()
    this.ragService = new RAGService()
    this.trendService = new TrendAnalysisService()
  }

  async initializeDemo(): Promise<void> {
    console.log("🚀 Initializing Social Media RAG Demo...")

    try {
      // Clear existing data
      console.log("🗑️ Clearing existing data...")
      await this.databaseService.clearAll()

      // Load demo posts
      console.log(`📊 Loading ${demoSocialMediaPosts.length} demo social media posts...`)
      console.log("Demo posts data:", demoSocialMediaPosts.map(p => ({ id: p.id, platform: p.platform, content: p.content.substring(0, 50) + "..." })))
      
      await this.databaseService.storePosts(demoSocialMediaPosts)
      
      // Verify posts were stored
      const postCount = await this.databaseService.getTotalPostsCount()
      console.log(`✅ Verified ${postCount} posts in database`)

      if (postCount === 0) {
        throw new Error("Failed to store demo posts - database count is 0")
      }

      // Load demo trends
      console.log(`📈 Loading ${demoTrendingTopics.length} demo trending topics...`)
      await this.databaseService.storeTrends(demoTrendingTopics)

      // Index posts for RAG system
      console.log("🔍 Indexing posts for RAG system...")
      await this.ragService.indexPosts()

      // Verify RAG indexing worked
      const ragStats = await this.ragService.getStats()
      console.log(`✅ RAG indexing completed: ${ragStats.totalDocuments} documents indexed`)

      if (ragStats.totalDocuments === 0) {
        throw new Error("Failed to index posts for RAG system - no documents indexed")
      }

      console.log("✅ Demo initialization completed successfully!")
      console.log(`📝 Loaded ${demoSocialMediaPosts.length} posts and ${demoTrendingTopics.length} trends`)

      // Log demo queries for reference
      console.log("\n🤖 Try these demo queries in the chat:")
      demoRAGQueries.forEach((query, index) => {
        console.log(`${index + 1}. "${query.query}"`)
      })
    } catch (error) {
      console.error("❌ Demo initialization failed:", error)
      console.error("Error details:", error instanceof Error ? error.stack : error)
      throw error
    }
  }

  async getDemoStats(): Promise<{
    posts: number
    trends: number
    ragDocuments: number
    platforms: string[]
    categories: string[]
  }> {
    const posts = await this.databaseService.getTotalPostsCount()
    const trends = await this.databaseService.getTrends()
    const ragStats = await this.ragService.getStats()

    const platforms = [...new Set(demoSocialMediaPosts.map((post) => post.platform))]
    const categories = [...new Set(demoTrendingTopics.map((trend) => trend.category))]

    return {
      posts,
      trends: trends.length,
      ragDocuments: ragStats.totalDocuments,
      platforms,
      categories,
    }
  }

  getDemoQueries() {
    return demoRAGQueries
  }

  async simulateRealTimeUpdates(): Promise<void> {
    // Simulate periodic updates to demo data
    setInterval(async () => {
      try {
        // Add some randomness to metrics
        const updatedPosts = demoSocialMediaPosts.map((post) => ({
          ...post,
          metrics: {
            ...post.metrics,
            likes: post.metrics.likes + Math.floor(Math.random() * 10),
            shares: post.metrics.shares + Math.floor(Math.random() * 5),
            comments: post.metrics.comments + Math.floor(Math.random() * 3),
          },
        }))

        await this.databaseService.storePosts(updatedPosts)
      } catch (error) {
        console.error("Error updating demo data:", error)
      }
    }, 60000) // Update every minute
  }
}

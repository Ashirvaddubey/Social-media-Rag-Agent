import type { SocialMediaPost, TrendingTopic } from "@/lib/types"
import { config } from "@/lib/config"

// MongoDB integration for persistent storage
export class DatabaseService {
  private static instance: DatabaseService
  private posts: Map<string, SocialMediaPost> = new Map()
  private trends: Map<string, TrendingTopic> = new Map()
  private users: Map<string, any> = new Map()
  private mongoClient: any = null
  private mongoDb: any = null
  private isMongoConnected: boolean = false

  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance
    }
    DatabaseService.instance = this
    this.initializeMongoDB()
  }

  async storePosts(posts: SocialMediaPost[]): Promise<void> {
    console.log(`Storing ${posts.length} posts to database`)

    for (const post of posts) {
      const postWithDate = {
        ...post,
        // Ensure timestamp is a Date object
        timestamp: new Date(post.timestamp),
      }
      
      this.posts.set(post.id, postWithDate)
      
      // Save to MongoDB if connected
      if (this.isMongoConnected && this.mongoDb) {
        try {
          const postsCollection = this.mongoDb.collection('posts')
          
          // Ensure the ID is clean and doesn't contain special characters
          const cleanId = post.id.replace(/[^a-zA-Z0-9_-]/g, '_')
          
          const mongoPost = {
            _id: cleanId,
            ...postWithDate,
            id: cleanId // Ensure consistency
          }
          
          await postsCollection.replaceOne({ _id: cleanId }, mongoPost, { upsert: true })
        } catch (error) {
          console.error("Error saving post to MongoDB:", error)
          console.error("Post ID:", post.id)
          console.error("Post data:", JSON.stringify(postWithDate, null, 2))
        }
      }
    }

    console.log(`Total posts in database: ${this.posts.size}`)
  }

  async getPosts(filters?: {
    platform?: string[]
    dateRange?: { start: Date; end: Date }
    limit?: number
  }): Promise<SocialMediaPost[]> {
    let posts = Array.from(this.posts.values())

    // Always try to load from MongoDB if in-memory storage is empty
    if (this.posts.size === 0 && this.isMongoConnected && this.mongoDb) {
      try {
        console.log("📥 Loading posts from MongoDB for RAG indexing...")
        const postsCollection = this.mongoDb.collection('posts')
        const mongoPosts = await postsCollection.find({}).toArray()
        
        // Convert MongoDB documents to SocialMediaPost format and store in memory
        mongoPosts.forEach((mongoPost: any) => {
          const post = {
            ...mongoPost,
            id: mongoPost._id.toString(),
            timestamp: new Date(mongoPost.timestamp)
          }
          this.posts.set(post.id, post)
        })
        
        posts = Array.from(this.posts.values())
        console.log(`📥 Loaded ${posts.length} posts from MongoDB into memory`)
      } catch (error) {
        console.error("Error loading posts from MongoDB:", error)
      }
    }

    // Apply filters
    if (filters?.platform) {
      posts = posts.filter((post) => filters.platform!.includes(post.platform))
    }

    if (filters?.dateRange) {
      posts = posts.filter(
        (post) => post.timestamp >= filters.dateRange!.start && post.timestamp <= filters.dateRange!.end,
      )
    }

    // Sort by timestamp (newest first)
    posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Apply limit
    if (filters?.limit) {
      posts = posts.slice(0, filters.limit)
    }

    return posts
  }

  async getPostById(id: string): Promise<SocialMediaPost | null> {
    return this.posts.get(id) || null
  }

  async getTotalPostsCount(): Promise<number> {
    return this.posts.size
  }

  async storeTrends(trends: TrendingTopic[]): Promise<void> {
    console.log(`Storing ${trends.length} trends to database`)

    for (const trend of trends) {
      this.trends.set(trend.id, trend)
      
      // Save to MongoDB if connected
      if (this.isMongoConnected && this.mongoDb) {
        try {
          const trendsCollection = this.mongoDb.collection('trends')
          const mongoTrend = {
            _id: trend.id,
            ...trend
          }
          
          await trendsCollection.replaceOne({ _id: trend.id }, mongoTrend, { upsert: true })
        } catch (error) {
          console.error("Error saving trend to MongoDB:", error)
        }
      }
    }
  }

  async getTrends(limit?: number): Promise<TrendingTopic[]> {
    let trends = Array.from(this.trends.values())

    // Sort by mentions (highest first)
    trends.sort((a, b) => b.mentions - a.mentions)

    if (limit) {
      trends = trends.slice(0, limit)
    }

    return trends
  }

  async searchPosts(query: string, limit = 10): Promise<SocialMediaPost[]> {
    const posts = Array.from(this.posts.values())
    const queryLower = query.toLowerCase()

    // Simple text search - in production, use full-text search or vector similarity
    const matchingPosts = posts.filter(
      (post) =>
        post.content.toLowerCase().includes(queryLower) ||
        post.hashtags.some((tag) => tag.toLowerCase().includes(queryLower)) ||
        post.author.toLowerCase().includes(queryLower),
    )

    // Sort by relevance (simple scoring based on matches)
    matchingPosts.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, queryLower)
      const scoreB = this.calculateRelevanceScore(b, queryLower)
      return scoreB - scoreA
    })

    return matchingPosts.slice(0, limit)
  }

  private calculateRelevanceScore(post: SocialMediaPost, query: string): number {
    let score = 0

    // Content matches
    const contentMatches = (post.content.toLowerCase().match(new RegExp(query, "g")) || []).length
    score += contentMatches * 2

    // Hashtag matches
    const hashtagMatches = post.hashtags.filter((tag) => tag.toLowerCase().includes(query)).length
    score += hashtagMatches * 3

    // Author matches
    if (post.author.toLowerCase().includes(query)) {
      score += 1
    }

    // Boost recent posts
    const hoursOld = (Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60)
    if (hoursOld < 24) {
      score += 1
    }

    return score
  }

  // User Management Methods
  async createUser(userData: {
    username: string
    email: string
    password: string
    createdAt: Date
    role: string
  }): Promise<any> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const user = {
      id: userId,
      ...userData,
      updatedAt: new Date()
    }
    
    // Save to in-memory storage
    this.users.set(userId, user)
    
    // Save to MongoDB if connected
    if (this.isMongoConnected && this.mongoDb) {
      try {
        const usersCollection = this.mongoDb.collection('users')
        const mongoUser = {
          _id: userId,
          ...userData,
          createdAt: userData.createdAt,
          updatedAt: user.updatedAt
        }
        
        await usersCollection.insertOne(mongoUser)
        console.log(`💾 User saved to MongoDB: ${user.email}`)
      } catch (error) {
        console.error("Error saving user to MongoDB:", error)
      }
    }
    
    console.log(`User created: ${user.email}`)
    return user
  }

  async getUserByEmail(email: string): Promise<any | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async getUserById(id: string): Promise<any | null> {
    return this.users.get(id) || null
  }

  async updateUser(id: string, updates: Partial<any>): Promise<any | null> {
    const user = this.users.get(id)
    if (!user) return null
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  // Utility method to clear all data (useful for testing)
  async clearAll(): Promise<void> {
    this.posts.clear()
    this.trends.clear()
    this.users.clear()
    console.log("Database cleared")
  }

  // MongoDB Connection Methods
  private async initializeMongoDB(): Promise<void> {
    try {
      if (!config.env.mongoDbUrl) {
        console.warn("⚠️ MongoDB URL not configured, using in-memory storage")
        return
      }

      // Dynamic import of MongoDB driver
      const { MongoClient } = await import('mongodb')
      
      this.mongoClient = new MongoClient(config.env.mongoDbUrl)
      await this.mongoClient.connect()
      
      this.mongoDb = this.mongoClient.db()
      this.isMongoConnected = true
      
      console.log("✅ Connected to MongoDB successfully!")
      
      // Load existing data from MongoDB
      await this.loadDataFromMongo()
      
    } catch (error) {
      console.warn("⚠️ MongoDB connection failed, using in-memory storage:", error)
      this.isMongoConnected = false
    }
  }

  private async loadDataFromMongo(): Promise<void> {
    try {
      // Load users
      const usersCollection = this.mongoDb.collection('users')
      const mongoUsers = await usersCollection.find({}).toArray()
      mongoUsers.forEach((user: any) => {
        this.users.set(user._id.toString(), { ...user, id: user._id.toString() })
      })
      console.log(`📥 Loaded ${mongoUsers.length} users from MongoDB`)

      // Load posts
      const postsCollection = this.mongoDb.collection('posts')
      const mongoPosts = await postsCollection.find({}).toArray()
      mongoPosts.forEach((post: any) => {
        this.posts.set(post._id.toString(), { ...post, id: post._id.toString() })
      })
      console.log(`📥 Loaded ${mongoPosts.length} posts from MongoDB`)

      // Load trends
      const trendsCollection = this.mongoDb.collection('trends')
      const mongoTrends = await trendsCollection.find({}).toArray()
      mongoTrends.forEach((trend: any) => {
        this.trends.set(trend._id.toString(), { ...trend, id: trend._id.toString() })
      })
      console.log(`📥 Loaded ${mongoTrends.length} trends from MongoDB`)

    } catch (error) {
      console.error("Error loading data from MongoDB:", error)
    }
  }

  async disconnect(): Promise<void> {
    if (this.mongoClient) {
      await this.mongoClient.close()
      console.log("🔌 Disconnected from MongoDB")
    }
  }
}

import { MongoClient, type Db } from "mongodb"
import { config } from "@/lib/config"

export interface SocialMediaPost {
  id: string
  platform: "twitter" | "reddit" | "youtube" | "hackernews" | "tiktok"
  title: string
  content: string
  author: string
  url: string
  score: number
  sentiment: "positive" | "negative" | "neutral"
  hashtags: string[]
  mentions: number
  createdAt: Date
  metadata: Record<string, any>
}

export interface User {
  id: string
  username: string
  email: string
  platformsFollowed: string[]
  alertsEnabled: boolean
  createdAt: Date
}

class MongoDBService {
  private client: MongoClient | null = null
  private db: Db | null = null

  async connect(): Promise<void> {
    if (this.client) return

    try {
      this.client = new MongoClient(config.database.url)
      await this.client.connect()
      this.db = this.client.db("Social-Media-Rag")
      console.log("Connected to MongoDB")
    } catch (error) {
      console.error("MongoDB connection error:", error)
      // Fallback to in-memory storage for demo
      this.setupInMemoryFallback()
    }
  }

  private setupInMemoryFallback(): void {
    console.log("Using in-memory storage fallback")
    // In-memory collections for demo
    this.inMemoryPosts = new Map()
    this.inMemoryUsers = new Map()
  }

  private inMemoryPosts = new Map<string, SocialMediaPost>()
  private inMemoryUsers = new Map<string, User>()

  async insertPost(post: SocialMediaPost): Promise<void> {
    if (this.db) {
      const collection = this.db.collection("posts")
      await collection.insertOne(post)
    } else {
      this.inMemoryPosts.set(post.id, post)
    }
  }

  async getPosts(limit = 100): Promise<SocialMediaPost[]> {
    if (this.db) {
      const collection = this.db.collection("posts")
      return (await collection.find({}).limit(limit).toArray()) as SocialMediaPost[]
    } else {
      return Array.from(this.inMemoryPosts.values()).slice(0, limit)
    }
  }

  async getPostsByPlatform(platform: string): Promise<SocialMediaPost[]> {
    if (this.db) {
      const collection = this.db.collection("posts")
      return (await collection.find({ platform }).toArray()) as SocialMediaPost[]
    } else {
      return Array.from(this.inMemoryPosts.values()).filter((p) => p.platform === platform)
    }
  }

  async insertUser(user: User): Promise<void> {
    if (this.db) {
      const collection = this.db.collection("users")
      await collection.insertOne(user)
    } else {
      this.inMemoryUsers.set(user.id, user)
    }
  }

  async getUsers(): Promise<User[]> {
    if (this.db) {
      const collection = this.db.collection("users")
      return (await collection.find({}).toArray()) as User[]
    } else {
      return Array.from(this.inMemoryUsers.values())
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

export const mongoService = new MongoDBService()

// Core data types for the Social Media RAG system

export interface SocialMediaPost {
  id: string
  platform: "reddit" | "youtube" | "hackernews" | "rss"
  content: string
  author: string
  timestamp: Date
  url: string
  metrics: {
    likes: number
    shares: number
    comments: number
    views?: number
  }
  hashtags: string[]
  mentions: string[]
  sentiment?: number
  embedding?: number[]
}

export interface TrendingTopic {
  id: string
  keyword: string
  mentions: number
  sentiment: number
  change: number
  platform: "reddit" | "youtube" | "hackernews" | "rss" | "all"
  category: string
  relatedPosts: string[] // Post IDs
  firstSeen: Date
  lastUpdated: Date
}

export interface VectorDocument {
  id: string
  content: string
  metadata: {
    postId: string
    platform: string
    timestamp: Date
    author: string
    url: string
    hashtags: string[]
    sentiment: number
  }
  embedding: number[]
}

export interface RAGQuery {
  query: string
  filters?: {
    platform?: string[]
    dateRange?: {
      start: Date
      end: Date
    }
    sentiment?: {
      min: number
      max: number
    }
    keywords?: string[]
  }
  limit?: number
}

export interface RAGResponse {
  answer: string
  sources: Array<{
    postId: string
    platform: string
    content: string
    url: string
    relevanceScore: number
  }>
  confidence: number
}

export interface IngestionStatus {
  reddit: "active" | "inactive" | "error"
  youtube: "active" | "inactive" | "error"
  hackernews: "active" | "inactive" | "error"
  rss: "active" | "inactive" | "error"
  lastUpdate: string
  totalPosts: number
  errors: string[]
}

export interface APICredentials {
  reddit: {
    clientId?: string
    clientSecret?: string
    userAgent?: string
  }
  youtube: {
    apiKey?: string
  }
  openai: {
    apiKey?: string
  }
}

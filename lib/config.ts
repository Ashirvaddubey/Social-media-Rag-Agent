// Configuration settings for the Social Media RAG system

export const config = {
  // API Configuration
  apis: {
    reddit: {
      baseUrl: "https://oauth.reddit.com",
      rateLimit: {
        requests: 60,
        window: 60 * 1000, // 1 minute
      },
    },
    youtube: {
      baseUrl: "https://www.googleapis.com/youtube/v3",
      rateLimit: {
        requests: 10000,
        window: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
    hackernews: {
      baseUrl: "https://hacker-news.firebaseio.com/v0",
      rateLimit: {
        requests: 100,
        window: 60 * 1000, // 1 minute
      },
    },
    rss: {
      baseUrl: "https://rss-feeds.com",
      rateLimit: {
        requests: 10,
        window: 60 * 1000, // 1 minute per feed
      },
    },
  },

  // RAG Configuration
  rag: {
    embedding: {
      model: "sentence-transformers/all-MiniLM-L6-v2",
      dimensions: 384,
      chunkSize: 512,
      chunkOverlap: 50,
    },
    vectorStore: {
      type: "chroma" as const,
      host: process.env.CHROMA_HOST || "localhost",
      port: Number.parseInt(process.env.CHROMA_PORT || "8000"),
      collection: "social_media_posts",
    },
    retrieval: {
      topK: 5,
      similarityThreshold: 0.3,
    },
    generation: {
      model: "gpt-3.5-turbo",
      maxTokens: 500,
      temperature: 0.7,
    },
  },

  // Data Processing
  processing: {
    batchSize: 100,
    maxRetries: 3,
    retryDelay: 1000,
    sentimentModel: "cardiffnlp/twitter-roberta-base-sentiment-latest",
  },

  // Trend Detection
  trends: {
    minMentions: 10,
    timeWindow: 24 * 60 * 60 * 1000, // 24 hours
    updateInterval: 15 * 60 * 1000, // 15 minutes
    categories: [
      "Technology",
      "Politics",
      "Entertainment",
      "Sports",
      "Business",
      "Science",
      "Health",
      "Environment",
      "Other",
    ],
  },

  // Database
  database: {
    url: process.env.MONGODB_URL || "mongodb://localhost:27017/Social-Media-Rag",
    maxConnections: 10,
  },

  // Environment Configuration
  env: {
    youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    redditClientId: process.env.REDDIT_CLIENT_ID || "",
    redditClientSecret: process.env.REDDIT_CLIENT_SECRET || "",
    redditUserAgent: process.env.REDDIT_USER_AGENT || "SocialMediaRAG/1.0",
    chromaHost: process.env.CHROMA_HOST || "localhost",
    chromaPort: Number.parseInt(process.env.CHROMA_PORT || "8000"),
    mongoDbUrl: process.env.MONGODB_URL || "",
    jwtSecret: process.env.JWT_SECRET || "",
  },

  // Ingestion Schedule
  ingestion: {
    interval: 30 * 60 * 1000, // 30 minutes
    platforms: {
      reddit: {
        enabled: true,
        subreddits: ["technology", "worldnews", "popular"],
        maxResults: 50,
      },
      youtube: {
        enabled: true,
        categories: ["Technology", "News & Politics"],
        maxResults: 25,
      },
      hackernews: {
        enabled: true,
        queries: ["AI", "technology", "startup", "programming"],
        maxResults: 100,
      },
      rss: {
        enabled: true,
        feeds: ["techcrunch", "theverge", "wired", "dev-to"],
        maxResults: 50,
      },
    },
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1NTM2MDY2NiwiaWF0IjoxNzU1MzYwNjY2fQ.o5c-mBhrK9K084JFFURU_Yo2J8u4C8wir2RKxkAh32c",
    tokenExpiry: "7d",
    demoCredentials: {
      username: "demo@socialrag.com",
      password: "demo123",
      token:
        "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1NTI2NjQ1NSwiaWF0IjoxNzU1MjY2NDU1fQ.z_JIWimho3eyas3g9ecA0CtUZ0UCFbhqOHM9x9hpztM",
    },
  },
} as const

export type Config = typeof config

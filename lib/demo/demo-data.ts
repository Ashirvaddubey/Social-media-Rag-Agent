import type { SocialMediaPost, TrendingTopic } from "@/lib/types"

export const demoSocialMediaPosts: SocialMediaPost[] = [
  {
    id: "demo-hackernews-1",
    platform: "hackernews",
    content:
      "Show HN: I built an AI-powered social media trend analyzer using RAG and vector databases",
    author: "tech_visionary",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    url: "https://news.ycombinator.com/item?id=demo-hackernews-1",
    metrics: { likes: 2847, shares: 0, comments: 156, views: 28470 },
    hashtags: ["AI", "RAG", "Show HN", "Vector Database"],
    mentions: [],
    sentiment: 0.92,
  },
  {
    id: "demo-reddit-1",
    platform: "reddit",
    content:
      "ELI5: Why is everyone suddenly talking about this new AI model? I've been seeing it everywhere but don't understand what makes it so revolutionary compared to existing models.",
    author: "curious_learner_42",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    url: "https://reddit.com/r/explainlikeimfive/comments/demo-reddit-1",
    metrics: { likes: 1456, shares: 0, comments: 234 },
    hashtags: ["eli5", "ai", "technology"],
    mentions: [],
    sentiment: 0.65,
  },
  {
    id: "demo-youtube-1",
    platform: "youtube",
    content:
      "Climate Action Now: The Urgent Need for Global Change\n\nIn this comprehensive analysis, we explore the latest climate data and what it means for our planet's future. The evidence is clear - we need immediate action.",
    author: "ClimateScience Today",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    url: "https://youtube.com/watch?v=demo-youtube-1",
    metrics: { likes: 8934, shares: 0, comments: 567, views: 125000 },
    hashtags: ["climate", "environment", "sustainability", "science"],
    mentions: [],
    sentiment: 0.35,
  },
  {
    id: "demo-rss-1",
    platform: "rss",
    content:
      "The new iPhone features are absolutely incredible! The camera quality is next level and the battery life is finally what we've been waiting for",
    author: "mobile_reviewer",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    url: "https://techcrunch.com/iphone-review-2024",
    metrics: { likes: 0, shares: 0, comments: 0, views: 56230 },
    hashtags: ["iPhone", "Apple", "Tech Review", "Camera"],
    mentions: [],
    sentiment: 0.88,
  },
  {
    id: "demo-reddit-2",
    platform: "reddit",
    content:
      "Unpopular opinion: The cryptocurrency market is showing signs of maturity that most people are missing. Here's my detailed analysis of why we might be entering a new phase...",
    author: "crypto_analyst_pro",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    url: "https://reddit.com/r/cryptocurrency/comments/demo-reddit-2",
    metrics: { likes: 892, shares: 0, comments: 167 },
    hashtags: ["cryptocurrency", "bitcoin", "analysis", "market"],
    mentions: [],
    sentiment: 0.72,
  },
  {
    id: "demo-youtube-2",
    platform: "youtube",
    content:
      "Remote Work Revolution: How Companies Are Adapting to the New Normal\n\nExploring the latest trends in remote work, productivity tools, and the future of distributed teams. What does this mean for the job market?",
    author: "Future of Work Channel",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    url: "https://youtube.com/watch?v=demo-youtube-2",
    metrics: { likes: 3456, shares: 0, comments: 289, views: 67890 },
    hashtags: ["remotework", "productivity", "future", "work"],
    mentions: [],
    sentiment: 0.78,
  },
  {
    id: "demo-rss-2",
    platform: "rss",
    content:
      "Breaking: Major breakthrough in renewable energy storage! This could be the game-changer we've been waiting for in the fight against climate change",
    author: "green_tech_news",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    url: "https://wired.com/renewable-energy-breakthrough-2024",
    metrics: { likes: 0, shares: 0, comments: 0, views: 72340 },
    hashtags: ["Renewable Energy", "Climate Action", "Sustainability", "Breakthrough"],
    mentions: [],
    sentiment: 0.85,
  },
]

export const demoTrendingTopics: TrendingTopic[] = [
  {
    id: "trend-ai-revolution",
    keyword: "AI Revolution",
    mentions: 15420,
    sentiment: 0.82,
    change: 234.5,
    platform: "all",
    category: "Technology",
    relatedPosts: ["demo-hackernews-1", "demo-reddit-1"],
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    lastUpdated: new Date(),
  },
  {
    id: "trend-climate-action",
    keyword: "Climate Action",
    mentions: 8934,
    sentiment: 0.45,
    change: -12.3,
    platform: "all",
    category: "Environment",
    relatedPosts: ["demo-youtube-1", "demo-rss-2"],
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    lastUpdated: new Date(),
  },
  {
    id: "trend-new-iphone",
    keyword: "New iPhone",
    mentions: 12567,
    sentiment: 0.78,
    change: 45.7,
    platform: "rss",
    category: "Technology",
    relatedPosts: ["demo-rss-1"],
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    lastUpdated: new Date(),
  },
  {
    id: "trend-remote-work",
    keyword: "Remote Work",
    mentions: 6789,
    sentiment: 0.68,
    change: 23.1,
    platform: "all",
    category: "Business",
    relatedPosts: ["demo-youtube-2"],
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    lastUpdated: new Date(),
  },
  {
    id: "trend-cryptocurrency",
    keyword: "Cryptocurrency",
    mentions: 4523,
    sentiment: 0.62,
    change: 8.9,
    platform: "reddit",
    category: "Business",
    relatedPosts: ["demo-reddit-2"],
    firstSeen: new Date(Date.now() - 1000 * 60 * 60 * 72), // 72 hours ago
    lastUpdated: new Date(),
  },
]

export const demoRAGQueries = [
  {
    query: "What are people saying about AI trends?",
    expectedResponse:
      "Based on recent social media data, there's significant excitement about AI developments, particularly around new breakthroughs showcased at tech conferences. The sentiment is overwhelmingly positive (82% positive sentiment) with users expressing amazement at recent AI capabilities. Key discussion points include machine learning advances, future applications, and revolutionary potential across industries.",
  },
  {
    query: "How do people feel about climate change?",
    expectedResponse:
      "Climate change discussions show mixed sentiment (45% positive) with urgent calls for action. While there's concern about environmental challenges, there's also optimism around renewable energy breakthroughs and sustainability innovations. The conversation spans from scientific analysis to practical solutions, with notable excitement about recent energy storage advances.",
  },
  {
    query: "What's trending in technology?",
    expectedResponse:
      "Technology trends are dominated by AI revolution discussions (234% growth), new iPhone releases (78% positive sentiment), and renewable energy breakthroughs. Cross-platform conversations show high engagement around machine learning capabilities, mobile technology improvements, and sustainable tech solutions.",
  },
]

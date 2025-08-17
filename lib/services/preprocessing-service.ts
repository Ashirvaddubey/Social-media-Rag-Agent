import type { SocialMediaPost } from "@/lib/types"

export class PreprocessingService {
  async processPosts(posts: SocialMediaPost[]): Promise<SocialMediaPost[]> {
    console.log(`Preprocessing ${posts.length} posts`)

    const processedPosts = await Promise.all(posts.map(async (post) => await this.processPost(post)))

    console.log(`Preprocessing completed for ${processedPosts.length} posts`)
    return processedPosts
  }

  private async processPost(post: SocialMediaPost): Promise<SocialMediaPost> {
    // Clean and normalize content
    const cleanedContent = this.cleanText(post.content)

    // Extract additional hashtags and mentions that might have been missed
    const extractedHashtags = this.extractHashtags(cleanedContent)
    const extractedMentions = this.extractMentions(cleanedContent)

    // Merge with existing hashtags and mentions
    const allHashtags = [...new Set([...post.hashtags, ...extractedHashtags])]
    const allMentions = [...new Set([...post.mentions, ...extractedMentions])]

    // Calculate basic sentiment (placeholder - in production use a proper sentiment model)
    const sentiment = this.calculateSentiment(cleanedContent)

    return {
      ...post,
      content: cleanedContent,
      hashtags: allHashtags,
      mentions: allMentions,
      sentiment,
    }
  }

  private cleanText(text: string): string {
    // Remove URLs
    text = text.replace(/https?:\/\/[^\s]+/g, "")

    // Remove extra whitespace
    text = text.replace(/\s+/g, " ").trim()

    // Remove special characters but keep hashtags and mentions
    text = text.replace(/[^\w\s#@.,!?-]/g, "")

    return text
  }

  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#\w+/g) || []
    return hashtags.map((tag) => tag.slice(1).toLowerCase())
  }

  private extractMentions(text: string): string[] {
    const mentions = text.match(/@\w+/g) || []
    return mentions.map((mention) => mention.slice(1).toLowerCase())
  }

  private calculateSentiment(text: string): number {
    // Simple sentiment analysis based on keyword matching
    // In production, use a proper sentiment analysis model

    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "awesome",
      "fantastic",
      "wonderful",
      "love",
      "like",
      "happy",
      "excited",
      "thrilled",
      "impressed",
      "brilliant",
      "perfect",
      "outstanding",
      "incredible",
      "superb",
      "magnificent",
    ]

    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "dislike",
      "angry",
      "sad",
      "disappointed",
      "frustrated",
      "annoyed",
      "disgusted",
      "furious",
      "outraged",
      "pathetic",
      "useless",
      "worthless",
      "disaster",
      "failure",
    ]

    const words = text.toLowerCase().split(/\s+/)
    let positiveCount = 0
    let negativeCount = 0

    for (const word of words) {
      if (positiveWords.includes(word)) {
        positiveCount++
      } else if (negativeWords.includes(word)) {
        negativeCount++
      }
    }

    const totalSentimentWords = positiveCount + negativeCount
    if (totalSentimentWords === 0) {
      return 0.5 // Neutral
    }

    // Return sentiment score between 0 (negative) and 1 (positive)
    return positiveCount / totalSentimentWords
  }

  // Utility method for chunking text for embeddings
  chunkText(text: string, chunkSize = 512, overlap = 50): string[] {
    const words = text.split(/\s+/)
    const chunks: string[] = []

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(" ")
      if (chunk.trim()) {
        chunks.push(chunk.trim())
      }
    }

    return chunks
  }
}

import { config } from "@/lib/config"

export class LLMService {
  private apiKey: string
  private model: string

  constructor() {
    this.apiKey = config.env.openaiApiKey
    this.model = config.rag.generation.model
  }

  async generateResponse(query: string, context: string): Promise<string> {
    if (!this.apiKey) {
      console.warn("OpenAI API key not configured, using mock response")
      return this.generateMockResponse(query, context)
    }

    try {
      const prompt = this.buildPrompt(query, context)

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: `You are an expert social media trend analyst. You analyze social media data to provide insights about trending topics, sentiment, and cultural phenomena. 

Your responses should be:
- Informative and well-structured
- Based on the provided social media context
- Include specific examples from the data when relevant
- Mention sentiment and engagement patterns
- Highlight cross-platform trends when applicable
- Be concise but comprehensive (aim for 2-4 paragraphs)

If the context is insufficient, clearly state this and suggest what additional information would be helpful.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: config.rag.generation.maxTokens,
          temperature: config.rag.generation.temperature,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error("LLM generation error:", error)
      return this.generateMockResponse(query, context)
    }
  }

  private buildPrompt(query: string, context: string): string {
    return `Based on the following social media data, please answer this question: "${query}"

Social Media Context:
${context}

Please provide a comprehensive analysis based on this data, including:
1. Key insights about the topic
2. Sentiment patterns across platforms
3. Notable trends or patterns
4. Cultural or societal implications if relevant

If the provided context doesn't contain enough information to fully answer the question, please say so and explain what additional data would be helpful.`
  }

  private generateMockResponse(query: string, context: string): string {
    // Extract some basic info from context for a more realistic mock response
    const platforms = this.extractPlatforms(context)
    const sentimentInfo = this.extractSentimentInfo(context)
    const keyTerms = this.extractKeyTerms(query)

    return `Based on the available social media data, here's what I found about "${query}":

**Cross-Platform Analysis**: The topic appears across ${platforms.length > 0 ? platforms.join(", ") : "multiple platforms"}, indicating widespread discussion and engagement.

**Sentiment Patterns**: ${sentimentInfo || "The overall sentiment appears mixed, with both positive and negative reactions visible across different platforms."}

**Key Insights**: This topic has generated significant discussion, particularly around ${keyTerms.length > 0 ? keyTerms.slice(0, 2).join(" and ") : "related themes"}. The conversation spans different communities and demographics, suggesting broad cultural relevance.

**Trend Implications**: The sustained engagement across platforms indicates this is more than a fleeting trend. The diverse range of perspectives and the cross-platform nature suggest it will likely continue to evolve and generate discussion.

*Note: This analysis is based on available social media data. For more detailed insights, additional data collection and analysis would be beneficial.*`
  }

  private extractPlatforms(context: string): string[] {
    const platforms: string[] = []
    if (context.includes("Platform: HACKERNEWS")) platforms.push("HackerNews")
    if (context.includes("Platform: REDDIT")) platforms.push("Reddit")
    if (context.includes("Platform: YOUTUBE")) platforms.push("YouTube")
    return platforms
  }

  private extractSentimentInfo(context: string): string | null {
    const sentimentMatches = context.match(/Sentiment: (\d+)% positive/g)
    if (sentimentMatches && sentimentMatches.length > 0) {
      const sentiments = sentimentMatches.map((match) => {
        const percentage = match.match(/(\d+)% positive/)
        return percentage ? Number.parseInt(percentage[1]) : 50
      })

      const avgSentiment = sentiments.reduce((sum, val) => sum + val, 0) / sentiments.length

      if (avgSentiment > 70) {
        return "The overall sentiment is predominantly positive, with users expressing enthusiasm and support."
      } else if (avgSentiment > 40) {
        return "The sentiment is mixed, with both positive and negative reactions from different user groups."
      } else {
        return "The sentiment leans negative, with users expressing concerns or criticism."
      }
    }

    return null
  }

  private extractKeyTerms(query: string): string[] {
    // Simple keyword extraction - remove common words
    const commonWords = ["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"]
    const words = query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.includes(word))

    return words.slice(0, 5) // Return top 5 terms
  }
}

import { config } from "@/lib/config"

interface EmbeddingResponse {
  embedding: number[]
  model: string
  usage?: {
    prompt_tokens: number
    total_tokens: number
  }
}

export class EmbeddingService {
  private apiKey: string
  private model: string
  private cache: Map<string, number[]>
  private huggingFaceModel: any = null

  constructor() {
    this.apiKey = config.env.openaiApiKey
    this.model = config.rag.embedding.model
    this.cache = new Map()
    this.initializeHuggingFace()
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(text)
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      let embedding: number[]

      if (this.apiKey && this.model.includes("openai")) {
        embedding = await this.generateOpenAIEmbedding(text)
      } else if (this.huggingFaceModel) {
        embedding = await this.generateHuggingFaceEmbedding(text)
      } else {
        // Fallback to mock embedding for demo purposes
        embedding = this.generateMockEmbedding(text)
      }

      // Cache the result
      this.cache.set(cacheKey, embedding)

      return embedding
    } catch (error) {
      console.error("Error generating embedding:", error)
      // Return mock embedding on error
      return this.generateMockEmbedding(text)
    }
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    // For simplicity, process one by one
    // In production, use batch API calls for better performance
    const embeddings = await Promise.all(texts.map((text) => this.generateEmbedding(text)))
    return embeddings
  }

  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: text.slice(0, 8000), // OpenAI has token limits
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].embedding
  }

  private async generateHuggingFaceEmbedding(text: string): Promise<number[]> {
    try {
      // Use HuggingFace Inference API
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
          },
          body: JSON.stringify({ inputs: text }),
        }
      )

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      // Handle different response formats from HuggingFace
      if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
        return data[0] // Direct embedding array
      } else if (data.embeddings && Array.isArray(data.embeddings[0])) {
        return data.embeddings[0] // Wrapped embedding array
      } else {
        throw new Error("Unexpected HuggingFace response format")
      }
    } catch (error) {
      console.error("HuggingFace embedding error:", error)
      // Fallback to mock embedding
      return this.generateMockEmbedding(text)
    }
  }

  private initializeHuggingFace(): void {
    try {
      // Try to load HuggingFace model dynamically
      if (typeof window === "undefined") {
        // Server-side only
        console.log("Initializing HuggingFace embedding service...")
        // In a real implementation, you would load the model here
        // For now, we'll use the API approach
      }
    } catch (error) {
      console.warn("HuggingFace model initialization failed:", error)
    }
  }

  private generateMockEmbedding(text: string): number[] {
    // Generate a deterministic mock embedding based on text content
    // This is for demo purposes only - in production, use real embeddings
    const dimensions = config.rag.embedding.dimensions

    // Simple hash-based approach for consistent embeddings
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }

    // Generate embedding vector
    const embedding: number[] = []
    for (let i = 0; i < dimensions; i++) {
      // Use hash and index to generate pseudo-random but deterministic values
      const seed = hash + i * 1234567
      const value = (Math.sin(seed) + 1) / 2 // Normalize to [0, 1]
      embedding.push(value)
    }

    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map((val) => val / magnitude)
  }

  private getCacheKey(text: string): string {
    // Simple cache key based on text hash
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `${this.model}_${hash}`
  }

  // Utility method to calculate cosine similarity
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same length")
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear()
  }
}

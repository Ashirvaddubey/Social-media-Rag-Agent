# Social Media RAG with Trend Analysis

A production-ready, AI-powered social media trend analysis system that combines real-time data ingestion, vector embeddings, and retrieval-augmented generation (RAG) to provide intelligent insights across HackerNews, RSS feeds, Reddit, and YouTube.

## 🚀 Features

### Core Capabilities
- **Multi-Platform Data Ingestion**: Automated collection from HackerNews, RSS feeds, Reddit, and YouTube APIs
- **AI-Powered RAG System**: Vector embeddings with OpenAI integration for contextual analysis
- **Real-Time Trend Detection**: Advanced algorithms for identifying trending topics and sentiment patterns
- **Interactive Dashboard**: Comprehensive analytics with charts, metrics, and real-time updates
- **Intelligent Chat Interface**: Ask questions about trends and get AI-powered insights

### Technical Highlights
- **Production-Ready Architecture**: Modular design with proper error handling and rate limiting
- **Vector Search**: ChromaDB/Pinecone integration for semantic similarity search
- **Sentiment Analysis**: Real-time sentiment tracking across platforms and topics
- **Cross-Platform Correlation**: Identify trends spanning multiple social media platforms
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Recharts** for data visualization

### Backend & AI
- **FastAPI** for data ingestion
- **OpenAI API** for embeddings and LLM
- **Vector Database** (ChromaDB/Pinecone)
- **Sentiment Analysis** with HuggingFace models

### Data Sources
- **HackerNews API** for tech trends and discussions (free, no API key required)
- **RSS Feeds** for news and social media mirrors (free, no API key required)
- **Reddit API** for posts and comments
- **YouTube Data API v3** for video metadata

## 🚀 Quick Start

### 1. Demo Mode (Recommended)
The easiest way to explore the system:

1. **Deploy to Vercel**: Click the deploy button or push to GitHub
2. **Initialize Demo**: Click "Initialize Demo" in the banner when the app loads
3. **Explore Features**: Try the sample queries in the chat interface

### 2. Production Setup

#### Prerequisites
- Node.js 18+
- Python 3.8+ (for ChromaDB)
- API keys for social media platforms
- OpenAI API key (optional, has HuggingFace fallback)

#### Environment Variables
Create a `.env.local` file:

\`\`\`env
# Social Media APIs
YOUTUBE_API_KEY=your_youtube_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=SocialMediaRAG/1.0

# AI Services
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Vector Database (ChromaDB)
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Database (optional, uses in-memory by default)
MONGODB_URL=your_database_url

# Authentication
JWT_SECRET=your_jwt_secret_here
\`\`\`

**Note**: HackerNews and RSS feeds are completely free and don't require API keys!

#### Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd social-media-rag

# Install dependencies
npm install

# Run development server
npm run dev

# Initialize with real data
curl -X POST http://localhost:3000/api/ingestion/trigger
\`\`\`

### 3. ChromaDB Setup (Optional but Recommended)

For better performance and persistent vector storage, set up ChromaDB:

#### Quick Setup (Linux/Mac)
```bash
# Run the setup script
chmod +x scripts/setup-chromadb.sh
./scripts/setup-chromadb.sh

# Start ChromaDB server
./start-chromadb.sh
```

#### Quick Setup (Windows)
```cmd
# Run the setup script
scripts\setup-chromadb.bat

# Start ChromaDB server
start-chromadb.bat
```

#### Manual Setup
```bash
# Install Python dependencies
pip install chromadb sentence-transformers

# Start ChromaDB server
chroma run --host localhost --port 8000
```

## 📊 System Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Dashboard                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Trend Charts  │  │  Chat Interface │  │   Metrics    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Ingestion     │  │      RAG        │  │    Trends    │ │
│  │     APIs        │  │     APIs        │  │     APIs     │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                   Core Services                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Data          │  │   Vector        │  │    Trend     │ │
│  │   Ingestion     │  │   Store         │  │   Analysis   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                 External Services                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Social Media  │  │     OpenAI      │  │   Vector     │ │
│  │      APIs       │  │      API        │  │   Database   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 🔧 Configuration

### API Rate Limits
The system includes built-in rate limiting:
- **HackerNews**: 100 requests per minute (free)
- **RSS**: 10 requests per minute per feed (free)
- **Reddit**: 60 requests per minute  
- **YouTube**: 10,000 requests per day

### Trend Detection Parameters
Customize in `lib/config.ts`:
- **Minimum mentions**: 10 (adjustable)
- **Time window**: 24 hours
- **Update interval**: 15 minutes
- **Growth threshold**: 20%

### RAG System Settings
- **Chunk size**: 512 tokens
- **Similarity threshold**: 0.7
- **Top-K retrieval**: 5 documents
- **Embedding models**: 
  - Primary: OpenAI text-embedding-ada-002
  - Fallback: HuggingFace sentence-transformers/all-MiniLM-L6-v2
- **Vector storage**: ChromaDB with in-memory fallback
- **LLM**: OpenAI GPT-3.5-turbo with fallback responses

## 📈 Usage Examples

### Chat Queries
Try these example queries:
- "What are people saying about AI trends?"
- "How do people feel about climate change?"
- "What's trending in technology?"
- "Analyze sentiment around the new iPhone"
- "What are the cross-platform trending topics?"

### API Endpoints
\`\`\`bash
# Trigger data ingestion
POST /api/ingestion/trigger

# Get trending topics
GET /api/trends?limit=10

# Chat with RAG system
POST /api/chat
{
  "message": "What are people saying about AI?"
}

# Initialize demo data
POST /api/demo/init
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Railway**: Use the provided `railway.json`
- **Render**: Configure with `render.yaml`
- **Docker**: Use the included `Dockerfile`

## 🔍 Monitoring & Analytics

The system includes comprehensive monitoring:
- **System Health**: Real-time service status
- **Performance Metrics**: Response times and accuracy
- **Data Quality**: Ingestion success rates
- **Usage Analytics**: Query patterns and trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions for questions

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced ML models for trend prediction
- [ ] Real-time streaming data
- [ ] Custom alert systems
- [ ] API rate optimization
- [ ] Enhanced visualization options

---

**Built with ❤️ for the social media analytics community**

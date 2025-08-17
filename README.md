# Social Media RAG with Trend Analysis

> **🚨 IMPORTANT: This is a PROTOTYPE/DEMO version of the application**
> 
> **🌐 Live Demo:** [https://social-media-j86rtzw5r-ashirvaddubeys-projects.vercel.app](https://social-media-j86rtzw5r-ashirvaddubeys-projects.vercel.app)
> 
> **📹 Complete Functional Demo Video:**
> 
> [![Complete Application Demo](https://img.youtube.com/vi/1M2cLjzgYLQ430AIanXUjo-og7PsDUwLm/maxresdefault.jpg)](https://www.youtube.com/watch?v=1M2cLjzgYLQ430AIanXUjo-og7PsDUwLm)
> 
> **📝 What This Is:** This repository contains a **prototype/flowchart** of the full Social Media RAG application. It demonstrates the user interface, navigation flow, and basic functionality with **demo accounts only**.
> 
> **🔑 Demo Accounts Available:**
> - **Admin:** `admin` / `admin123`
> - **User1:** `user1` / `user123`
> - **Demo:** `demo` / `demo123`
> 
> **⚠️ Limitations:** This prototype does NOT include:
> - Real data ingestion from social media platforms
> - ChromaDB vector database functionality
> - YouTube API integration
> - Actual RAG (Retrieval-Augmented Generation) features
> - Production backend services
> 
> **🎯 Purpose:** This serves as a **UI/UX demonstration** and **application flow showcase** for stakeholders, investors, or development planning.
> 
> **🚀 Full Application:** Watch the complete functional demo video above to see the fully working application with all features implemented.

---

A production-ready, AI-powered social media trend analysis system that combines real-time data ingestion, vector embeddings, and retrieval-augmented generation (RAG) to provide intelligent insights across HackerNews, RSS feeds, Reddit, and YouTube.

## 🚀 Features

> **📋 Note:** The features listed below represent the **intended functionality** of the full production application. The current prototype demonstrates the **UI/UX design** and **user flow** but does not include the actual backend implementation.

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

### 0. Watch Complete Functional Demo 🎥
**📹 Complete Application Demo Video:**

[![Complete Application Demo](https://img.youtube.com/vi/1M2cLjzgYLQ430AIanXUjo-og7PsDUwLm/maxresdefault.jpg)](https://www.youtube.com/watch?v=1M2cLjzgYLQ430AIanXUjo-og7PsDUwLm)

This video demonstrates the **fully functional Social Media RAG application** with:
- ✅ Real-time data ingestion from social media platforms
- ✅ Working ChromaDB vector database
- ✅ YouTube API integration
- ✅ Complete RAG (Retrieval-Augmented Generation) system
- ✅ AI-powered insights and trend analysis
- ✅ Production-ready backend services

**Watch this first to understand the complete vision and functionality!**

### 1. Demo Mode (Recommended)
The easiest way to explore the system:

1. **Visit Live Demo**: [https://social-media-j86rtzw5r-ashirvaddubeys-projects.vercel.app](https://social-media-j86rtzw5r-ashirvaddubeys-projects.vercel.app)
2. **Use Demo Accounts**: Login with any of the provided demo credentials above
3. **Explore Features**: Navigate through the UI to see the application flow and design
4. **Understand the Concept**: This demonstrates the intended user experience and feature set

### 2. Production Setup

#### Prerequisites
- Node.js 18+
- Python 3.8+ (for ChromaDB)
- API keys for social media platforms
- OpenAI API key (optional, has HuggingFace fallback)

#### Environment Variables
Create a `.env.local` file:

```env
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
```

**Note**: HackerNews and RSS feeds are completely free and don't require API keys!

#### Installation
```bash
# Clone the repository
git clone <repository-url>
cd social-media-rag

# Install dependencies
npm install

# Run development server
npm run dev

# Initialize with real data
curl -X POST http://localhost:3000/api/ingestion/trigger
```

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

```
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
```

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
```bash
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
```

## 🚀 Deployment

### Current Status: PROTOTYPE DEPLOYED ✅

**🌐 Live Demo Application:** [https://social-media-j86rtzw5r-ashirvaddubeys-projects.vercel.app](https://social-media-j86rtzw5r-ashirvaddubeys-projects.vercel.app)

**📱 What's Currently Deployed:**
- ✅ **Frontend UI/UX** - Complete Next.js application with modern design
- ✅ **Demo User Accounts** - Working authentication system
- ✅ **Application Flow** - Full navigation and user experience
- ✅ **Responsive Design** - Mobile and desktop optimized interface

**🚫 What's NOT Deployed (Prototype Limitations):**
- ❌ **Backend Services** - No real data processing
- ❌ **Social Media APIs** - No actual data ingestion
- ❌ **ChromaDB** - No vector database functionality
- ❌ **RAG System** - No AI-powered insights
- ❌ **Real-time Data** - Static demo content only

### Future Production Deployment

#### Vercel (Frontend)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

#### Backend Services (Required for Full Functionality)
- **Render/Railway**: For Python FastAPI backend
- **ChromaDB**: For vector database
- **Social Media APIs**: For real data ingestion
- **AI Services**: For embeddings and LLM functionality

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

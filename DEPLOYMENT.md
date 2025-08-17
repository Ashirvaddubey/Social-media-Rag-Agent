# Social Media RAG - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option 2: Local Development
\`\`\`bash
# Clone and install
git clone <your-repo>
cd social-media-rag
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start MongoDB (if using local)
mongod --dbpath ./data/db

# Start ChromaDB (if using local)
chromadb server

# Run development server
npm run dev
\`\`\`

## 🔧 Environment Variables Setup

### Required for Production:
- `MONGODB_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key for embeddings/LLM

### Social Media APIs (provided):
- `REDDIT_CLIENT_ID=9YBlwspQa47TRuFbMenm_w`
- `REDDIT_CLIENT_SECRET=PT3GsZHHyWTavTkkwMwB8kbluQmxRg`
- `REDDIT_USER_AGENT=social-media-rag/1.0 by Guilty-Giraffe-6724`
- `YOUTUBE_API_KEY=AIzaSyCg1aTs2A4_27LKb9JGlfiUunD2xWdHegE`

### Optional:
- `REDDIT_CLIENT_ID` - Reddit API (uses mock data if not provided)
- `REDDIT_CLIENT_SECRET` - Reddit API (uses mock data if not provided)
- `CHROMA_HOST` - ChromaDB host (defaults to localhost)
- `CHROMA_PORT` - ChromaDB port (defaults to 8000)

## 🎯 Demo Account

The system includes a built-in demo account:
- **Email:** demo@socialrag.com
- **Password:** demo123
- **JWT Token:** eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTc1NTI2NjQ1NSwiaWF0IjoxNzU1MjY2NDU1fQ.z_JIWimho3eyas3g9ecA0CtUZ0UCFbhqOHM9x9hpztM

## 📊 Features Included

✅ **Authentication System**
- JWT-based login
- Demo account functionality
- Secure token verification

✅ **Data Ingestion Pipeline**
- Reddit API integration (working)
- YouTube API integration (working)
- HackerNews API integration (free, no API key required)
- RSS feeds integration (free, no API key required)
- HackerNews scraping
- TikTok scraping (optional)

✅ **RAG System**
- Vector embeddings with OpenAI
- ChromaDB vector storage
- Semantic search and retrieval
- Context-aware responses

✅ **Trend Analysis**
- Real-time trend detection
- Sentiment analysis
- Cross-platform correlation
- Growth pattern analysis

✅ **Modern UI**
- Responsive dashboard
- Real-time charts
- Chat interface
- System health monitoring

## 🔄 Data Flow

1. **Authentication** → JWT login with demo account
2. **Data Ingestion** → Fetch from Reddit/YouTube APIs
3. **Processing** → Clean, chunk, and analyze sentiment
4. **Vector Storage** → Generate embeddings and store in ChromaDB
5. **Trend Detection** → Analyze patterns and growth
6. **User Interface** → Display trends, charts, and chat

## 🛠 Production Checklist

- [ ] Set up MongoDB database
- [ ] Configure ChromaDB server
- [ ] Add OpenAI API key
- [ ] Set secure JWT secret
- [ ] Configure domain and CORS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy

## 📈 Scaling Considerations

- Use MongoDB Atlas for cloud database
- Use Pinecone for cloud vector storage
- Implement Redis for caching
- Add queue system for background jobs
- Set up load balancing
- Implement proper logging and monitoring

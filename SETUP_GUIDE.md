# 🚀 Complete Setup Guide for Social Media RAG

This guide will help you set up your Social Media RAG application with all features fully functional.

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Git** - [Download here](https://git-scm.com/)

## 🔑 Required API Keys

### 1. YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials → API Key
5. Copy the API key

### 2. OpenAI API (Optional but Recommended)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login and go to API Keys
3. Create a new API key
4. Copy the API key

### 3. HuggingFace API (Optional)
1. Go to [HuggingFace](https://huggingface.co/)
2. Sign up/Login and go to Settings → Access Tokens
3. Create a new token
4. Copy the token

### 4. Reddit API (Optional)
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create a new app (select "script")
3. Note down Client ID and Client Secret
4. Set User Agent to: `SocialMediaRAG/1.0`

## 🛠️ Installation Steps

### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd social-media-rag

# Install Node.js dependencies
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Social Media APIs
YOUTUBE_API_KEY=AIzaSyCg1aTs2A4_27LKb9JGlfiUunD2xWdHegE
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
JWT_SECRET=your_super_secret_jwt_key_here
```

### Step 3: Set Up ChromaDB (Recommended)

#### Option A: Quick Setup Script
**Linux/Mac:**
```bash
chmod +x scripts/setup-chromadb.sh
./scripts/setup-chromadb.sh
```

**Windows:**
```cmd
scripts\setup-chromadb.bat
```

#### Option B: Manual Setup
```bash
# Install Python dependencies
pip install chromadb sentence-transformers

# Start ChromaDB server
chroma run --host localhost --port 8000
```

### Step 4: Start the Application
```bash
# Start the development server
npm run dev
```

## 🧪 Testing the Setup

### 1. Check ChromaDB Connection
Open your browser and go to `http://localhost:8000/docs` - you should see the ChromaDB API documentation.

### 2. Initialize Demo Data
1. Open your app at `http://localhost:3000`
2. Click "Initialize Demo" in the banner
3. Wait for the confirmation message

### 3. Test RAG System
1. Go to the chat interface
2. Try these sample queries:
   - "What are people saying about AI trends?"
   - "How do people feel about climate change?"
   - "What's trending in technology?"

### 4. Test Data Ingestion
```bash
# Trigger data ingestion from all platforms
curl -X POST http://localhost:3000/api/ingestion/trigger
```

## 🔍 Troubleshooting

### ChromaDB Connection Issues
- **Error**: "ChromaDB connection failed"
  - **Solution**: Make sure ChromaDB server is running on port 8000
  - **Check**: `http://localhost:8000/docs` should be accessible

- **Error**: "Port 8000 already in use"
  - **Solution**: Change port in `.env.local` and ChromaDB startup command
  - **Example**: `CHROMA_PORT=8001` and `chroma run --host localhost --port 8001`

### API Key Issues
- **YouTube API**: Check if the API key is valid and YouTube Data API v3 is enabled
- **OpenAI API**: Verify the API key and check your OpenAI account balance
- **HuggingFace**: Ensure the token has read permissions

### Performance Issues
- **Slow embeddings**: The app will fall back to mock embeddings if AI services fail
- **Memory usage**: ChromaDB provides persistent storage, reducing memory usage

## 🚀 Production Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Docker Deployment
```bash
# Build the image
docker build -t social-media-rag .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.local social-media-rag
```

## 📊 Monitoring and Maintenance

### Check System Health
- Monitor the System Health component in the dashboard
- Check ChromaDB status at `http://localhost:8000/docs`
- Review logs for any errors

### Regular Maintenance
- Monitor API rate limits
- Check ChromaDB storage usage
- Review and rotate API keys periodically

## 🎯 What You Get

With this setup, your Social Media RAG will have:

✅ **Real-time data ingestion** from YouTube, Reddit, HackerNews, and RSS  
✅ **AI-powered embeddings** using OpenAI or HuggingFace  
✅ **Vector similarity search** with ChromaDB  
✅ **Intelligent trend analysis** across platforms  
✅ **RAG-powered chat interface** for insights  
✅ **Beautiful dashboard** with real-time metrics  
✅ **Fallback systems** for reliability  

## 🆘 Need Help?

- Check the console logs for detailed error messages
- Review the API documentation at `http://localhost:8000/docs`
- Ensure all environment variables are set correctly
- Verify that ChromaDB server is running

Your Social Media RAG is now ready to provide intelligent insights into social media trends! 🎉

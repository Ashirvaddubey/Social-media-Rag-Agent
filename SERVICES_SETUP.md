# Services Setup Guide

## Required Services for Social Media RAG

Your app needs these services running locally:

### 1. ChromaDB (Vector Database)
\`\`\`bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
chromadb server --host localhost --port 8000
\`\`\`

**Verify ChromaDB is running:**
- Open browser: `http://localhost:8000`
- Should see ChromaDB API documentation

### 2. MongoDB (Document Database)
\`\`\`bash
# Install MongoDB (macOS with Homebrew)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or start manually
mongod --dbpath /usr/local/var/mongodb
\`\`\`

**Verify MongoDB is running:**
\`\`\`bash
# Connect to MongoDB
mongosh
# Should connect to mongodb://localhost:27017
\`\`\`

### 3. Start Your Next.js App
\`\`\`bash
# In your project directory
npm run dev
\`\`\`

## Quick Start Script

Create this script to start all services:

\`\`\`bash
#!/bin/bash
# save as start-services.sh

echo "Starting ChromaDB..."
chromadb server --host localhost --port 8000 &

echo "Starting MongoDB..."
mongod --dbpath /usr/local/var/mongodb &

echo "Waiting for services to start..."
sleep 5

echo "Starting Next.js app..."
npm run dev
\`\`\`

Make it executable:
\`\`\`bash
chmod +x start-services.sh
./start-services.sh
\`\`\`

## Environment Variables

Your `.env` file should have:
\`\`\`env
CHROMA_HOST=localhost
CHROMA_PORT=8000
MONGODB_URL=mongodb://localhost:27017/Social-Media-Rag
\`\`\`

## Troubleshooting

### ChromaDB Issues
- **Port already in use**: Change port in config or kill existing process
- **Permission denied**: Run with `sudo` or check file permissions

### MongoDB Issues  
- **Connection refused**: Ensure MongoDB is running on port 27017
- **Database not found**: MongoDB creates databases automatically

### App Issues
- **Services not connecting**: Check if services are running on correct ports
- **Demo mode**: App works without services using mock data

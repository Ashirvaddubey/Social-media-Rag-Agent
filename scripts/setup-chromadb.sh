#!/bin/bash

# ChromaDB Setup Script for Social Media RAG
# This script helps you set up ChromaDB for vector storage

echo "🚀 Setting up ChromaDB for Social Media RAG..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed. Please install pip3 first."
    exit 1
fi

echo "✅ Python and pip are available"

# Install ChromaDB
echo "📦 Installing ChromaDB..."
pip3 install chromadb

# Install sentence-transformers for embeddings
echo "📦 Installing sentence-transformers..."
pip3 install sentence-transformers

# Create a simple ChromaDB server startup script
echo "📝 Creating ChromaDB server startup script..."
cat > start-chromadb.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ChromaDB server..."
echo "📊 ChromaDB will be available at http://localhost:8000"
echo "🔍 API documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

chroma run --host localhost --port 8000
EOF

chmod +x start-chromadb.sh

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start ChromaDB server: ./start-chromadb.sh"
echo "2. In another terminal, start your Next.js app: npm run dev"
echo "3. The app will automatically connect to ChromaDB at localhost:8000"
echo ""
echo "🔧 Environment variables to add to .env.local:"
echo "CHROMA_HOST=localhost"
echo "CHROMA_PORT=8000"
echo ""
echo "🎯 Your Social Media RAG will now use ChromaDB for vector storage!"


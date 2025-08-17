#!/bin/bash

echo "🚀 Starting Social Media RAG Application..."
echo ""

# Check if ChromaDB is running
echo "📊 Checking ChromaDB status..."
if curl -s http://localhost:8000/api/v1/heartbeat > /dev/null 2>&1; then
    echo "✅ ChromaDB is already running"
else
    echo "⚠️  ChromaDB is not running on port 8000"
    echo ""
    echo "🔧 Starting ChromaDB server..."
    echo "📝 ChromaDB will be available at http://localhost:8000"
    echo ""
    
    # Start ChromaDB in background
    chroma run --host localhost --port 8000 &
    CHROMA_PID=$!
    
    echo "⏳ Waiting for ChromaDB to start..."
    sleep 5
    
    # Check if ChromaDB started successfully
    if curl -s http://localhost:8000/api/v1/heartbeat > /dev/null 2>&1; then
        echo "✅ ChromaDB started successfully (PID: $CHROMA_PID)"
    else
        echo "❌ Failed to start ChromaDB"
        exit 1
    fi
fi

echo ""
echo "🌐 Starting Next.js application..."
echo "📱 App will be available at http://localhost:3000"
echo ""
echo "🎯 Press Ctrl+C to stop the app"
echo ""

# Function to cleanup ChromaDB on exit
cleanup() {
    echo ""
    echo "🛑 Stopping ChromaDB..."
    if [ ! -z "$CHROMA_PID" ]; then
        kill $CHROMA_PID 2>/dev/null
        echo "✅ ChromaDB stopped"
    fi
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Start the Next.js application
npm run dev


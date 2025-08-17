@echo off
REM ChromaDB Setup Script for Social Media RAG (Windows)
REM This script helps you set up ChromaDB for vector storage

echo 🚀 Setting up ChromaDB for Social Media RAG...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed. Please install Python 3.8+ first.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip is required but not installed. Please install pip first.
    pause
    exit /b 1
)

echo ✅ Python and pip are available

REM Install ChromaDB
echo 📦 Installing ChromaDB...
pip install chromadb

REM Install sentence-transformers for embeddings
echo 📦 Installing sentence-transformers...
pip install sentence-transformers

REM Create a simple ChromaDB server startup script
echo 📝 Creating ChromaDB server startup script...
(
echo @echo off
echo echo 🚀 Starting ChromaDB server...
echo echo 📊 ChromaDB will be available at http://localhost:8000
echo echo 🔍 API documentation: http://localhost:8000/docs
echo echo.
echo echo Press Ctrl+C to stop the server
echo echo.
echo.
echo chroma run --host localhost --port 8000
echo pause
) > start-chromadb.bat

echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Start ChromaDB server: start-chromadb.bat
echo 2. In another terminal, start your Next.js app: npm run dev
echo 3. The app will automatically connect to ChromaDB at localhost:8000
echo.
echo 🔧 Environment variables to add to .env.local:
echo CHROMA_HOST=localhost
echo CHROMA_PORT=8000
echo.
echo 🎯 Your Social Media RAG will now use ChromaDB for vector storage!
pause


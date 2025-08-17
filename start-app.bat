@echo off
echo 🚀 Starting Social Media RAG Application...
echo.

REM Check if ChromaDB is running
echo 📊 Checking ChromaDB status...
curl -s http://localhost:8000/api/v1/heartbeat >nul 2>&1
if errorlevel 1 (
    echo ⚠️  ChromaDB is not running on port 8000
    echo.
    echo 🔧 Starting ChromaDB server...
    echo 📝 ChromaDB will be available at http://localhost:8000
    echo.
    start "ChromaDB Server" cmd /k "chroma run --host localhost --port 8000"
    echo ⏳ Waiting for ChromaDB to start...
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ ChromaDB is already running
)

echo.
echo 🌐 Starting Next.js application...
echo 📱 App will be available at http://localhost:3000
echo.
echo 🎯 Press Ctrl+C in this window to stop the app
echo.

REM Start the Next.js application
npm run dev

pause


@echo off
echo 🚀 Starting ChromaDB server...
echo 📊 ChromaDB will be available at http://localhost:8000
echo 🔍 API documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

chroma run --host localhost --port 8000
pause

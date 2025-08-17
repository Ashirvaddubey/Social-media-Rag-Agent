#!/usr/bin/env python3
"""
Proper ChromaDB server with all required API endpoints
"""
import chromadb
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from typing import Dict, Any, List, Optional

print("🚀 Starting Proper ChromaDB Server...")

# Create FastAPI app
app = FastAPI(title="ChromaDB Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create ChromaDB client
try:
    client = chromadb.PersistentClient(path="./chroma_db")
    print("✅ ChromaDB client created successfully")
except Exception as e:
    print(f"⚠️ Using in-memory client due to error: {e}")
    client = chromadb.Client()

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "ChromaDB Server is running", "status": "healthy"}

# ChromaDB heartbeat endpoint (required by the app)
@app.get("/api/v1/heartbeat")
async def heartbeat():
    try:
        # Test if we can list collections
        collections = client.list_collections()
        return {"status": "healthy", "collections": len(collections)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ChromaDB collections endpoint
@app.get("/api/v1/collections")
async def list_collections():
    try:
        collections = client.list_collections()
        return {"collections": [{"name": col.name, "id": col.id} for col in collections]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB create collection endpoint
@app.post("/api/v1/collections")
async def create_collection(request: Dict[str, Any]):
    try:
        name = request.get("name", "default")
        metadata = request.get("metadata", {})
        collection = client.create_collection(name=name, metadata=metadata)
        return {"id": collection.id, "name": collection.name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB get collection endpoint
@app.get("/api/v1/collections/{collection_id}")
async def get_collection(collection_id: str):
    try:
        collection = client.get_collection(collection_id)
        return {"id": collection.id, "name": collection.name}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Collection not found")

# ChromaDB add documents endpoint
@app.post("/api/v1/collections/{collection_id}/add")
async def add_documents(collection_id: str, request: Dict[str, Any]):
    try:
        collection = client.get_collection(collection_id)
        
        ids = request.get("ids", [])
        documents = request.get("documents", [])
        metadatas = request.get("metadatas", [])
        embeddings = request.get("embeddings", [])
        
        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )
        
        return {"status": "success", "added": len(ids)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB query endpoint
@app.post("/api/v1/collections/{collection_id}/query")
async def query_collection(collection_id: str, request: Dict[str, Any]):
    try:
        collection = client.get_collection(collection_id)
        
        query_texts = request.get("query_texts", [])
        n_results = request.get("n_results", 10)
        where = request.get("where", {})
        where_document = request.get("where_document", {})
        
        results = collection.query(
            query_texts=query_texts,
            n_results=n_results,
            where=where,
            where_document=where_document
        )
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB delete endpoint
@app.post("/api/v1/collections/{collection_id}/delete")
async def delete_documents(collection_id: str, request: Dict[str, Any]):
    try:
        collection = client.get_collection(collection_id)
        
        ids = request.get("ids", [])
        where = request.get("where", {})
        where_document = request.get("where_document", {})
        
        collection.delete(
            ids=ids,
            where=where,
            where_document=where_document
        )
        
        return {"status": "success", "deleted": len(ids) if ids else "filtered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB update endpoint
@app.post("/api/v1/collections/{collection_id}/update")
async def update_collection(collection_id: str, request: Dict[str, Any]):
    try:
        collection = client.get_collection(collection_id)
        
        ids = request.get("ids", [])
        documents = request.get("documents", [])
        metadatas = request.get("metadatas", [])
        embeddings = request.get("embeddings", [])
        
        collection.update(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )
        
        return {"status": "success", "updated": len(ids)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB count endpoint
@app.get("/api/v1/collections/{collection_id}/count")
async def count_documents(collection_id: str):
    try:
        collection = client.get_collection(collection_id)
        count = collection.count()
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ChromaDB peek endpoint
@app.get("/api/v1/collections/{collection_id}/peek")
async def peek_collection(collection_id: str, limit: int = 10):
    try:
        collection = client.get_collection(collection_id)
        results = collection.peek(limit=limit)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

print("🌐 Starting server on http://127.0.0.1:8000")
print("📚 ChromaDB API endpoints available:")
print("   - GET  /api/v1/heartbeat")
print("   - GET  /api/v1/collections")
print("   - POST /api/v1/collections")
print("   - GET  /api/v1/collections/{id}")
print("   - POST /api/v1/collections/{id}/add")
print("   - POST /api/v1/collections/{id}/query")
print("   - POST /api/v1/collections/{id}/delete")
print("   - POST /api/v1/collections/{id}/update")
print("   - GET  /api/v1/collections/{id}/count")
print("   - GET  /api/v1/collections/{id}/peek")

# Start the server
if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )


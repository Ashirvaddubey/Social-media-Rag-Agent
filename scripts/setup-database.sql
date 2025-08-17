-- Database schema for Social Media RAG system
-- This script sets up the necessary tables for storing social media data

-- Posts table for storing social media posts
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(255) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    url TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    hashtags TEXT, -- JSON array of hashtags
    mentions TEXT, -- JSON array of mentions
    sentiment DECIMAL(3,2), -- Sentiment score between 0 and 1
    embedding TEXT, -- JSON array of embedding vector
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trending topics table
CREATE TABLE IF NOT EXISTS trending_topics (
    id VARCHAR(255) PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    mentions INTEGER DEFAULT 0,
    sentiment DECIMAL(3,2),
    change_percentage DECIMAL(5,2),
    platform VARCHAR(50),
    category VARCHAR(100),
    related_posts TEXT, -- JSON array of post IDs
    first_seen TIMESTAMP NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vector documents table for RAG system
CREATE TABLE IF NOT EXISTS vector_documents (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    embedding TEXT NOT NULL, -- JSON array of embedding vector
    metadata TEXT, -- JSON object with additional metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_timestamp ON posts(timestamp);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
CREATE INDEX IF NOT EXISTS idx_trending_topics_keyword ON trending_topics(keyword);
CREATE INDEX IF NOT EXISTS idx_trending_topics_mentions ON trending_topics(mentions);
CREATE INDEX IF NOT EXISTS idx_vector_documents_post_id ON vector_documents(post_id);

-- Insert some sample data for testing
INSERT OR IGNORE INTO posts (id, platform, content, author, timestamp, url, likes, shares, comments, hashtags, mentions, sentiment) VALUES
('sample-1', 'twitter', 'Just discovered this amazing AI breakthrough! The future is here 🚀 #AI #innovation #tech', 'tech_enthusiast', '2024-01-15 10:30:00', 'https://twitter.com/tech_enthusiast/status/sample-1', 245, 67, 23, '["ai", "innovation", "tech"]', '[]', 0.8),
('sample-2', 'reddit', 'ELI5: Why is everyone talking about this new AI trend? I have been seeing it everywhere but do not understand the hype.', 'curious_redditor', '2024-01-15 08:15:00', 'https://reddit.com/r/technology/comments/sample-2', 567, 0, 89, '["eli5", "ai"]', '[]', 0.5),
('sample-3', 'youtube', 'AI Revolution: The Future is Here!\n\nIn this video, we explore the latest developments in artificial intelligence and what it means for the future.', 'TechVisionChannel', '2024-01-15 06:00:00', 'https://youtube.com/watch?v=sample-3', 15420, 0, 1247, '["ai", "future", "innovation"]', '[]', 0.7);

INSERT OR IGNORE INTO trending_topics (id, keyword, mentions, sentiment, change_percentage, platform, category, related_posts, first_seen) VALUES
('trend-1', 'AI', 15420, 0.75, 23.5, 'all', 'Technology', '["sample-1", "sample-2", "sample-3"]', '2024-01-15 00:00:00'),
('trend-2', 'Climate Change', 8934, 0.35, -12.1, 'all', 'Environment', '[]', '2024-01-14 12:00:00'),
('trend-3', 'Cryptocurrency', 12567, 0.55, 45.2, 'all', 'Business', '[]', '2024-01-15 03:00:00');

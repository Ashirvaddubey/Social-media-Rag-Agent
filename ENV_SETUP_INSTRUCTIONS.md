# 🔧 Environment Setup Instructions

## Where to Place the .env File

**IMPORTANT**: The `.env` file must be placed in the **ROOT** of your project folder, at the same level as `package.json`.

\`\`\`
your-project-folder/
├── .env                    ← Place it HERE
├── package.json
├── next.config.js
├── app/
├── components/
├── lib/
└── ...
\`\`\`

## Step-by-Step Setup

### 1. Download & Extract
- Download the ZIP file from v0
- Extract it to your desired location
- Open the folder in your code editor

### 2. Create .env File
- In the root folder (same level as package.json)
- Create a new file named `.env` (no extension)
- Copy the complete .env content provided

### 3. Verify File Structure
Your folder should look like this:
\`\`\`
social-media-rag/
├── .env                    ✅ Your environment file
├── package.json            ✅ Dependencies
├── SETUP_GUIDE.md         ✅ Setup instructions
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── api/
├── components/
├── lib/
└── ...
\`\`\`

### 4. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 5. Start Local Services (Optional)
If you want full functionality:

**MongoDB** (if you have it installed):
\`\`\`bash
mongod
\`\`\`

**ChromaDB** (if you want vector search):
\`\`\`bash
pip install chromadb
chromadb server
\`\`\`

### 6. Run the Application
\`\`\`bash
npm run dev
\`\`\`

### 7. Access the App
- Open http://localhost:3000
- Use demo credentials:
  - Email: `demo@socialrag.com`
  - Password: `demo123`

## 🚨 Important Notes

1. **Never commit .env to Git** - it contains sensitive API keys
2. **The app works without MongoDB/ChromaDB** - it has fallback demo data
3. **All your API keys are already configured** - no additional setup needed
4. **Demo mode works immediately** - you can test without external services

## 🆕 **Updated API Sources (Free APIs)**

The application now uses these **free** APIs instead of Twitter:

- **HackerNews API** - Tech trends and discussions (no API key required)
- **RSS Feeds** - News and social media mirrors (no API key required)  
- **Reddit API** - Rich text discussions (requires free API keys)
- **YouTube API** - Video trends (requires free API key)

## 🔍 Troubleshooting

**If you get "Module not found" errors:**
\`\`\`bash
npm install --force
\`\`\`

**If the app won't start:**
- Check that .env is in the root folder
- Verify no syntax errors in .env file
- Try deleting node_modules and running `npm install` again

**If login doesn't work:**
- Verify .env file is properly saved
- Check browser console for errors
- Try the demo login credentials exactly as shown

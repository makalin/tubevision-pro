# API & AI Integration Documentation

## 🤖 AI Features (OpenAI Integration)

### Setup
1. Get your OpenAI API key from: https://platform.openai.com/api-keys
2. Add to `.env` file: `OPENAI_API_KEY=your_key_here`
3. Restart the server

### Available AI Endpoints

#### 1. Check AI Status
```
GET /api/ai/status
```
Returns whether AI is enabled and configured.

#### 2. Generate AI Titles
```
POST /api/ai/titles
Body: { topic: "string", count: 10, useAI: true }
```
Generates viral YouTube titles using GPT-4o-mini.

#### 3. Generate AI Script
```
POST /api/ai/script
Body: { 
  topic: "string", 
  videoType: "tutorial|review|list|challenge", 
  duration: "5 minutes|10 minutes|15 minutes|20 minutes" 
}
```
Generates complete video scripts with hooks, intros, content, and CTAs.

#### 4. Get SEO Suggestions
```
POST /api/ai/seo-suggestions
Body: { title: "string", description: "string" }
```
Provides AI-powered SEO improvement suggestions.

#### 5. Generate Thumbnail Texts
```
POST /api/ai/thumbnail-texts
Body: { topic: "string", style: "bold" }
```
Generates short, impactful thumbnail text suggestions.

---

## 📺 YouTube API Integration

### Setup
1. Get YouTube Data API v3 key from: https://console.cloud.google.com/apis/credentials
2. Enable "YouTube Data API v3" in Google Cloud Console
3. Add to `.env` file: `YOUTUBE_API_KEY=your_key_here`
4. Restart the server

### Available YouTube Endpoints

#### 1. Check YouTube API Status
```
GET /api/youtube/status
```
Returns whether YouTube API is enabled.

#### 2. Analyze Channel
```
POST /api/youtube/analyze-channel
Body: { url: "string" } or { channelId: "string" }
```
Gets real channel statistics (subscribers, views, video count).

#### 3. Search Channels
```
GET /api/youtube/search-channels?q=channel_name
```
Searches for YouTube channels by name.

#### 4. Get Video Statistics
```
POST /api/youtube/video-stats
Body: { videoId: "string" }
```
Gets real video statistics (views, likes, comments).

#### 5. Get Trending Keywords
```
GET /api/youtube/trending-keywords?region=US&limit=10
```
Gets trending keywords from YouTube's popular videos.

---

## 🔄 Integrated Features

### Title Generator
- **With AI**: Uses OpenAI GPT-4o-mini for intelligent title generation
- **Without AI**: Falls back to 30+ proven templates
- **Endpoint**: `POST /api/titles/generate` (now includes AI option)

### Competitor Analysis
- **With YouTube API**: Real channel stats, subscriber counts, view data
- **Without API**: Simulated data for testing
- **Endpoint**: `POST /api/competitors/analyze`

### Keyword Research
- **With YouTube API**: Real trending keywords from YouTube
- **Without API**: Simulated keyword data
- **Endpoint**: `POST /api/keywords/research`

---

## 📝 Usage Examples

### Using AI Title Generation
```javascript
// Frontend
const result = await fetch('/api/titles/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    topic: 'JavaScript Tutorial',
    useAI: true 
  })
});
```

### Using YouTube Channel Analysis
```javascript
// Frontend
const result = await fetch('/api/youtube/analyze-channel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    url: 'https://www.youtube.com/@channelname' 
  })
});
```

---

## ⚙️ Configuration

### Environment Variables (.env)
```env
# AI Configuration
OPENAI_API_KEY=sk-...

# YouTube API Configuration
YOUTUBE_API_KEY=AIza...

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Fallback Behavior
- **AI Features**: If OpenAI API key is not set, features fall back to template-based generation
- **YouTube Features**: If YouTube API key is not set, features use simulated data
- **All features work without API keys** - they just use enhanced templates/simulated data

---

## 🚀 Getting API Keys

### OpenAI API Key
1. Visit https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy and add to `.env`

### YouTube Data API Key
1. Visit https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy and add to `.env`

---

## 📊 API Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "data": {...},
  "error": "error message if failed",
  "aiUsed": true|false,  // For AI endpoints
  "apiUsed": true|false  // For YouTube endpoints
}
```

---

## 🔒 Security Notes

- Never commit `.env` file to version control
- API keys are server-side only
- All API calls are made from the server, not the client
- Rate limiting should be implemented for production use


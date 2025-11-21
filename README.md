# **TubeVision Pro v2.0 🚀**

**TubeVision Pro** is the ultimate "All-in-One" SaaS-style dashboard for YouTube content creators. Designed by **Digital Vision**, this suite moves beyond simple generators into a full workflow management system with AI integration, real-time updates, and professional-grade features.

## **🌟 Pro Features**

### **🔐 Authentication & Security**

* **User Authentication** - Secure JWT-based login system
* **User Management** - Profile management, password changes, user administration
* **Protected Routes** - All features secured with authentication
* **Session Management** - Persistent sessions with token-based auth

### **📊 Command Center**

* **Dashboard**: Real-time overview with live metrics and activity feed  
* **Analytics Dashboard**: Track views, watch time, and subscriber growth  
* **Competitor Spy**: Real YouTube channel analysis with API integration

### **🎬 Pre-Production Tools**

* **Script Architect**: Structured writing tool with AI script generation  
* **Viral Title Generator**: AI-powered title generation with 30+ templates  
* **Video Ideas Board**: Capture, organize, and prioritize content ideas  
* **Content Calendar**: Schedule and manage publishing dates

### **🎨 Creative Studio**

* **Thumbnail Studio Ultimate**:  
  * **HTML5 Canvas Engine**: No external image libraries  
  * **Image Upload**: Support for local PNG/JPG uploads  
  * **Compositing**: Control background colors, opacity overlays, and dynamic text positioning  
  * **Instant Export**: Download high-res PNGs directly to your device  
  * **Settings Persistence**: Save and reload thumbnail configurations
  * **AI Thumbnail Text**: Generate catchy thumbnail text with AI

### **🚀 Optimization Engine**

* **Shorts Viral Engine**: Generate optimized hashtags for vertical content  
* **SEO Auditor**: Comprehensive metadata analysis with AI suggestions  
* **Keyword Research**: Real keyword data from YouTube API

### **💰 Monetization Tools**

* **Revenue Calculator**: Estimate earnings based on views and RPM  
* **Revenue Tracking**: Track revenue by source and date

### **📚 Content Management**

* **Video Library**: Manage all your videos with status tracking  
* **Export/Import**: Backup and restore all your data

### **🤖 AI Features (OpenAI Integration)**

* **AI Title Generation** - GPT-4o-mini powered viral titles
* **AI Script Writing** - Generate complete video scripts
* **AI SEO Suggestions** - Get intelligent SEO improvements
* **AI Thumbnail Text** - Generate catchy thumbnail text

### **📺 YouTube API Integration**

* **Real Channel Stats** - Get actual subscriber/view counts
* **Channel Search** - Find channels by name
* **Video Statistics** - Real view/like/comment data
* **Trending Keywords** - Get trending keywords from YouTube
* **Competitor Analysis** - Analyze real competitor channels

### **🌍 Multi-Language Support**

* **English** - Full translation
* **Turkish (Türkçe)** - Complete Turkish translation
* **Easy to Extend** - Add more languages easily

### **🔔 Real-Time Features**

* **WebSocket Integration**: Live updates across all features  
* **Activity Logging**: Real-time activity feed  
* **Data Persistence**: All data saved to JSON database

## **🛠️ Tech Stack**

### **Backend**
* **Node.js** with Express.js
* **JWT Authentication** (jsonwebtoken, bcryptjs)
* **WebSocket** (ws) for real-time updates
* **JSON Database** for data persistence (no native dependencies)
* **OpenAI API** for AI features
* **YouTube Data API v3** for real data
* **RESTful API** architecture

### **Frontend**
* **Vanilla JavaScript** (ES6+)
* **Custom CSS3** (Dark Mode SaaS Theme)
* **HTML5 Canvas** for thumbnail generation
* **WebSocket Client** for real-time data synchronization
* **JWT Token Management** for authentication

## **🚀 Getting Started**

### **Prerequisites**
* Node.js (v14 or higher)
* npm or yarn
* (Optional) OpenAI API key for AI features
* (Optional) YouTube Data API v3 key for real YouTube data

### **Installation**

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/makalin/tubevision-pro.git
   cd tubevision-pro
   ```

2. **Install dependencies**:  
   ```bash
   npm install
   ```

3. **Configure environment variables** (Optional but Recommended):  
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```env
   # AI Configuration (Optional)
   OPENAI_API_KEY=sk-your-key-here
   
   # YouTube API Configuration (Optional)
   YOUTUBE_API_KEY=AIza-your-key-here
   
   # JWT Secret (Change in production!)
   JWT_SECRET=your-secret-key-here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```
   
   **Note**: The app works without API keys using template-based features, but AI and real YouTube data require keys.

4. **Start the server**:  
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**:  
   * Open your browser and navigate to `http://localhost:3000`
   * You'll be redirected to the login page
   * Register a new account or login
   * Start using all features!

## **📖 API Documentation**

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference including:
- Authentication endpoints
- AI endpoints
- YouTube API endpoints
- All feature endpoints

## **🔑 Getting API Keys**

### **OpenAI API Key** (for AI features)
1. Visit https://platform.openai.com
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy and add to `.env`

### **YouTube Data API Key** (for real YouTube data)
1. Visit https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. Copy and add to `.env`

## **✨ Complete Feature List**

✅ **User Authentication** - Secure login/register system  
✅ **Real-time Dashboard** - Live updates via WebSocket  
✅ **Data Persistence** - All data saved to JSON database  
✅ **RESTful API** - Full CRUD operations for all features  
✅ **AI Integration** - OpenAI GPT-4o-mini for intelligent features  
✅ **YouTube API** - Real channel and video data  
✅ **Content Calendar** - Schedule and manage publishing  
✅ **Video Ideas Board** - Organize content ideas with priorities  
✅ **Analytics Dashboard** - Track performance metrics  
✅ **Revenue Calculator** - Estimate and track earnings  
✅ **Keyword Research** - Real keyword data from YouTube  
✅ **Video Library** - Manage all your videos  
✅ **AI Title Generator** - GPT-powered title generation  
✅ **AI Script Writer** - Generate scripts with AI  
✅ **AI SEO Suggestions** - Get AI-powered SEO improvements  
✅ **Script Management** - Save and load scripts  
✅ **Thumbnail Studio** - Save thumbnail settings  
✅ **Competitor Tracking** - Real YouTube channel analysis  
✅ **SEO Auditing** - Comprehensive analysis with history  
✅ **Shorts Engine** - Generate optimized hashtags  
✅ **Export/Import** - Backup and restore data  
✅ **Activity Logging** - Real-time activity feed  
✅ **Multi-language** - English & Turkish support  
✅ **User Management** - Profile, settings, user administration

## **🔒 Security Features**

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Secure session management
- Email validation
- Password strength requirements

## **📁 Project Structure**

```
tubevision-pro/
├── server/
│   ├── index.js              # Main server + WebSocket
│   ├── database.js           # JSON database layer
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── services/
│   │   ├── ai.js            # OpenAI integration
│   │   └── youtube.js      # YouTube API integration
│   ├── routes/              # API endpoints
│   ├── locales/             # Translation files
│   └── templates/           # Script & thumbnail templates
├── public/
│   ├── index.html           # Main application
│   └── login.html          # Login/Register page
├── data/                    # Database storage (auto-created)
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## **🌐 API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/change-password` - Change password

### **AI Features**
- `GET /api/ai/status` - Check AI status
- `POST /api/ai/titles` - Generate AI titles
- `POST /api/ai/script` - Generate AI script
- `POST /api/ai/seo-suggestions` - Get SEO suggestions
- `POST /api/ai/thumbnail-texts` - Generate thumbnail texts

### **YouTube API**
- `GET /api/youtube/status` - Check YouTube API status
- `POST /api/youtube/analyze-channel` - Analyze channel
- `GET /api/youtube/search-channels` - Search channels
- `POST /api/youtube/video-stats` - Get video stats
- `GET /api/youtube/trending-keywords` - Get trending keywords

### **Features**
- `GET /api/dashboard/stats` - Dashboard statistics
- `POST /api/titles/generate` - Generate titles
- `POST /api/scripts/save` - Save script
- `POST /api/seo/audit` - Run SEO audit
- And many more...

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## **💡 Usage Tips**

1. **First Time Setup**: Register an account at `/login.html`
2. **Enable AI**: Add `OPENAI_API_KEY` to `.env` for AI features
3. **Enable YouTube Data**: Add `YOUTUBE_API_KEY` to `.env` for real data
4. **Language**: Switch language from sidebar dropdown
5. **Export Data**: Use Export button in sidebar to backup your data

## **🔄 Data Management**

- All data is stored in `data/database.json`
- Users can export/import their data
- Data is user-specific (requires authentication)
- Automatic backups recommended

## **🐛 Troubleshooting**

### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### **API Keys Not Working**
- Verify keys are correct in `.env`
- Check API quotas/limits
- Ensure APIs are enabled in respective dashboards

### **Authentication Issues**
- Clear browser localStorage
- Check token expiration (7 days)
- Re-login if token expired

## **👤 Creator**

**Mehmet T. AKALIN**

* **Company**: [Digital Vision](https://dv.com.tr)  
* **GitHub**: [@makalin](https://github.com/makalin)  
* **LinkedIn**: [Mehmet T. AKALIN](https://www.linkedin.com/in/makalin/)  
* **X (Twitter)**: [@makalin](https://x.com/makalin)  
* **Personal CV**: [View CV](https://dv.com.tr/makalin/)

## **📄 License**

This project is licensed under the MIT License.

## **🙏 Acknowledgments**

Built with:
- Express.js
- OpenAI API
- YouTube Data API v3
- WebSocket
- JWT Authentication

*Powered by Digital Vision*

---

**Version**: 2.0.0  
**Last Updated**: 2025

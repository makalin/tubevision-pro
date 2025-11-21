const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const dashboardRoutes = require('./routes/dashboard');
const titlesRoutes = require('./routes/titles');
const scriptRoutes = require('./routes/scripts');
const thumbnailRoutes = require('./routes/thumbnails');
const competitorRoutes = require('./routes/competitors');
const shortsRoutes = require('./routes/shorts');
const seoRoutes = require('./routes/seo');
const calendarRoutes = require('./routes/calendar');
const ideasRoutes = require('./routes/ideas');
const videosRoutes = require('./routes/videos');
const analyticsRoutes = require('./routes/analytics');
const revenueRoutes = require('./routes/revenue');
const keywordsRoutes = require('./routes/keywords');
const exportRoutes = require('./routes/export');
const templatesRoutes = require('./routes/templates');
const i18nRoutes = require('./routes/i18n');
const aiRoutes = require('./routes/ai');
const youtubeRoutes = require('./routes/youtube');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Serve login page
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Redirect root to login if not authenticated, otherwise to main app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Public Routes
app.use('/api/auth', authRoutes);
app.use('/api/i18n', i18nRoutes);
app.use('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Protected API Routes (require authentication)
const { authenticateToken } = require('./middleware/auth');
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/titles', authenticateToken, titlesRoutes);
app.use('/api/scripts', authenticateToken, scriptRoutes);
app.use('/api/thumbnails', authenticateToken, thumbnailRoutes);
app.use('/api/competitors', authenticateToken, competitorRoutes);
app.use('/api/shorts', authenticateToken, shortsRoutes);
app.use('/api/seo', authenticateToken, seoRoutes);
app.use('/api/calendar', authenticateToken, calendarRoutes);
app.use('/api/ideas', authenticateToken, ideasRoutes);
app.use('/api/videos', authenticateToken, videosRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/revenue', authenticateToken, revenueRoutes);
app.use('/api/keywords', authenticateToken, keywordsRoutes);
app.use('/api/export', authenticateToken, exportRoutes);
app.use('/api/templates', authenticateToken, templatesRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/youtube', authenticateToken, youtubeRoutes);
app.use('/api/users', usersRoutes);


// Create HTTP server
const server = http.createServer(app);

// WebSocket Server for real-time updates
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  clients.add(ws);

  // Send initial connection message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to TubeVision Pro real-time server'
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Broadcast to all clients (real-time updates)
      broadcast({
        type: 'update',
        data: data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast function
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Make broadcast available to routes
app.locals.broadcast = broadcast;

// Start server
server.listen(PORT, () => {
  console.log(`🚀 TubeVision Pro Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for real-time updates`);
});

module.exports = { app, server, broadcast };


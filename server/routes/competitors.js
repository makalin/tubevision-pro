const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { getChannelStats, extractChannelId, isYouTubeEnabled } = require('../services/youtube');

// Add competitor
router.post('/add', async (req, res) => {
  try {
    const { name, url, avg_views } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const id = uuidv4();
    dbHelpers.saveCompetitor.run(id, name, url || '', avg_views || 0);

    // Log activity
    dbHelpers.addActivity.run('competitor_added', `Added competitor: ${name}`, `Avg views: ${avg_views || 'N/A'}`);

    // Broadcast
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'competitor_added',
        data: { id, name, avg_views }
      });
    }

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all competitors
router.get('/', (req, res) => {
  try {
    const competitors = dbHelpers.getAllCompetitors.all();
    res.json({ success: true, competitors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze competitor with real YouTube API
router.post('/analyze', async (req, res) => {
  try {
    const { url, channelId } = req.body;
    
    if (!url && !channelId) {
      return res.status(400).json({ success: false, error: 'URL or channelId is required' });
    }

    // Try real YouTube API first
    if (isYouTubeEnabled()) {
      let id = channelId;
      if (url && !id) {
        id = extractChannelId(url);
      }

      if (id) {
        const stats = await getChannelStats(id);
        if (stats) {
          // Calculate average views per video
          const avgViews = stats.videoCount > 0 
            ? Math.floor(stats.viewCount / stats.videoCount)
            : 0;

          const analysis = {
            channel_name: stats.name,
            subscriber_count: stats.subscriberCount,
            total_views: stats.viewCount,
            video_count: stats.videoCount,
            avg_views_per_video: avgViews,
            thumbnail: stats.thumbnail,
            apiUsed: true
          };

          return res.json({ success: true, analysis });
        }
      }
    }

    // Fallback to simulated data if API not available
    const analysis = {
      channel_name: 'Competitor Channel',
      subscriber_count: Math.floor(Math.random() * 1000000),
      total_views: Math.floor(Math.random() * 10000000),
      avg_views_per_video: Math.floor(Math.random() * 100000),
      upload_frequency: '3 videos/week',
      top_keywords: ['tutorial', 'guide', 'review'],
      engagement_rate: (Math.random() * 5 + 2).toFixed(2) + '%',
      apiUsed: false
    };

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


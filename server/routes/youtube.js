const express = require('express');
const router = express.Router();
const {
  isYouTubeEnabled,
  getChannelStats,
  extractChannelId,
  searchChannel,
  getVideoStats,
  getTrendingKeywords
} = require('../services/youtube');

// Check YouTube API status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    enabled: isYouTubeEnabled(),
    message: isYouTubeEnabled()
      ? 'YouTube API is enabled'
      : 'YouTube API disabled. Add YOUTUBE_API_KEY to .env to enable.'
  });
});

// Analyze competitor channel
router.post('/analyze-channel', async (req, res) => {
  try {
    const { url, channelId } = req.body;
    
    if (!url && !channelId) {
      return res.status(400).json({ success: false, error: 'URL or channelId is required' });
    }

    if (!isYouTubeEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'YouTube API not enabled. Add YOUTUBE_API_KEY to .env'
      });
    }

    let id = channelId;
    if (url && !id) {
      id = extractChannelId(url);
    }

    if (!id) {
      return res.status(400).json({ success: false, error: 'Could not extract channel ID from URL' });
    }

    const stats = await getChannelStats(id);
    
    if (stats) {
      res.json({ success: true, stats, apiUsed: true });
    } else {
      res.status(404).json({ success: false, error: 'Channel not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search for channels
router.get('/search-channels', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    if (!isYouTubeEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'YouTube API not enabled. Add YOUTUBE_API_KEY to .env'
      });
    }

    const channels = await searchChannel(q);
    
    res.json({ success: true, channels: channels || [], apiUsed: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get video statistics
router.post('/video-stats', async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ success: false, error: 'Video ID is required' });
    }

    if (!isYouTubeEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'YouTube API not enabled. Add YOUTUBE_API_KEY to .env'
      });
    }

    const stats = await getVideoStats(videoId);
    
    if (stats) {
      res.json({ success: true, stats, apiUsed: true });
    } else {
      res.status(404).json({ success: false, error: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trending keywords
router.get('/trending-keywords', async (req, res) => {
  try {
    const { region = 'US', limit = 10 } = req.query;

    if (!isYouTubeEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'YouTube API not enabled. Add YOUTUBE_API_KEY to .env'
      });
    }

    const keywords = await getTrendingKeywords(region, parseInt(limit));
    
    res.json({ success: true, keywords: keywords || [], apiUsed: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


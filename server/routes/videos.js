const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Get all videos
router.get('/', (req, res) => {
  try {
    const videos = dbHelpers.getAllVideos();
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add video
router.post('/', (req, res) => {
  try {
    const { title, status, url, publish_date, views, likes, comments } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    const id = dbHelpers.addVideo(title, status, url, publish_date, views, likes, comments);
    
    // Log activity
    dbHelpers.addActivity('video_added', `Video added: ${title}`, `Status: ${status}`);
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update video
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = dbHelpers.updateVideo(id, updates);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


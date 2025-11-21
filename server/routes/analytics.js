const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Get analytics
router.get('/', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const analytics = dbHelpers.getAnalytics(startDate, endDate);
    
    // Calculate totals
    const totals = analytics.reduce((acc, a) => {
      acc.views += a.views || 0;
      acc.watch_time += a.watch_time || 0;
      acc.subscribers_gained += a.subscribers_gained || 0;
      return acc;
    }, { views: 0, watch_time: 0, subscribers_gained: 0 });
    
    res.json({ success: true, analytics, totals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add analytics data
router.post('/', (req, res) => {
  try {
    const { video_id, date, views, watch_time, subscribers_gained } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    
    const id = dbHelpers.addAnalytics(video_id, date, views, watch_time, subscribers_gained);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { v4: uuidv4 } = require('uuid');

// Get dashboard stats
router.get('/stats', (req, res) => {
  try {
    const stats = dbHelpers.getStats.get();
    const activities = dbHelpers.getActivities.all();
    
    res.json({
      success: true,
      stats: stats || {
        total_views: 0,
        ctr: 0,
        revenue: 0,
        titles_generated: 0,
        scripts_created: 0,
        thumbnails_created: 0
      },
      activities: activities || []
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update stats
router.post('/stats', (req, res) => {
  try {
    const { total_views, ctr, revenue, titles_generated, scripts_created, thumbnails_created } = req.body;
    
    dbHelpers.updateStats.run(
      total_views || 0,
      ctr || 0,
      revenue || 0,
      titles_generated || 0,
      scripts_created || 0,
      thumbnails_created || 0
    );

    // Broadcast update
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'dashboard_update',
        data: { total_views, ctr, revenue }
      });
    }

    res.json({ success: true, message: 'Stats updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add activity
router.post('/activity', (req, res) => {
  try {
    const { type, title, description } = req.body;
    
    dbHelpers.addActivity.run(type, title, description || '');

    // Broadcast activity
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'activity',
        data: { type, title, description, timestamp: new Date().toISOString() }
      });
    }

    res.json({ success: true, message: 'Activity logged' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { v4: uuidv4 } = require('uuid');

// Save thumbnail settings
router.post('/save', (req, res) => {
  try {
    const { id, name, settings, image_data } = req.body;
    const thumbId = id || uuidv4();
    
    dbHelpers.saveThumbnail.run(
      thumbId,
      name || 'Untitled Thumbnail',
      JSON.stringify(settings || {}),
      image_data || ''
    );

    // Update stats
    const stats = dbHelpers.getStats.get();
    if (!id) { // New thumbnail
      dbHelpers.updateStats.run(
        stats.total_views,
        stats.ctr,
        stats.revenue,
        stats.titles_generated,
        stats.scripts_created,
        (stats.thumbnails_created || 0) + 1
      );
    }

    // Log activity
    dbHelpers.addActivity.run('thumbnail_created', name || 'Thumbnail created', `Thumbnail ID: ${thumbId}`);

    // Broadcast
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'thumbnail_saved',
        data: { id: thumbId, name }
      });
    }

    res.json({ success: true, id: thumbId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get thumbnail
router.get('/:id', (req, res) => {
  try {
    const thumbnail = dbHelpers.getThumbnail.get(req.params.id);
    if (!thumbnail) {
      return res.status(404).json({ success: false, error: 'Thumbnail not found' });
    }
    thumbnail.settings = JSON.parse(thumbnail.settings || '{}');
    res.json({ success: true, thumbnail });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all thumbnails
router.get('/', (req, res) => {
  try {
    const thumbnails = dbHelpers.getAllThumbnails.all();
    thumbnails.forEach(t => {
      t.settings = JSON.parse(t.settings || '{}');
    });
    res.json({ success: true, thumbnails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


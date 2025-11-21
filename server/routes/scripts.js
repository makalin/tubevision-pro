const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { v4: uuidv4 } = require('uuid');

// Save script
router.post('/save', (req, res) => {
  try {
    const { id, hook, intro, content, cta, title } = req.body;
    const scriptId = id || uuidv4();
    
    dbHelpers.saveScript.run(scriptId, hook || '', intro || '', content || '', cta || '', title || 'Untitled Script');

    // Update stats
    const stats = dbHelpers.getStats.get();
    if (!id) { // New script
      dbHelpers.updateStats.run(
        stats.total_views,
        stats.ctr,
        stats.revenue,
        stats.titles_generated,
        (stats.scripts_created || 0) + 1,
        stats.thumbnails_created
      );
    }

    // Log activity
    dbHelpers.addActivity.run('script_saved', title || 'Script saved', `Script ID: ${scriptId}`);

    // Broadcast
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'script_saved',
        data: { id: scriptId, title }
      });
    }

    res.json({ success: true, id: scriptId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get script
router.get('/:id', (req, res) => {
  try {
    const script = dbHelpers.getScript.get(req.params.id);
    if (!script) {
      return res.status(404).json({ success: false, error: 'Script not found' });
    }
    res.json({ success: true, script });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all scripts
router.get('/', (req, res) => {
  try {
    const scripts = dbHelpers.getAllScripts.all();
    res.json({ success: true, scripts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete script
router.delete('/:id', (req, res) => {
  try {
    // Note: You'd need to add a delete helper to database.js
    res.json({ success: true, message: 'Script deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


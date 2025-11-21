const express = require('express');
const router = express.Router();
const { scriptTemplates } = require('../templates/scripts');
const { thumbnailPresets } = require('../templates/thumbnails');

// Get script templates
router.get('/scripts', (req, res) => {
  try {
    res.json({ success: true, templates: scriptTemplates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get script template by type
router.get('/scripts/:type', (req, res) => {
  try {
    const { type } = req.params;
    const template = scriptTemplates[type];
    if (template) {
      res.json({ success: true, template });
    } else {
      res.status(404).json({ success: false, error: 'Template type not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get thumbnail presets
router.get('/thumbnails', (req, res) => {
  try {
    res.json({ success: true, presets: thumbnailPresets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get thumbnail preset by type
router.get('/thumbnails/:type', (req, res) => {
  try {
    const { type } = req.params;
    const preset = thumbnailPresets[type];
    if (preset) {
      res.json({ success: true, preset });
    } else {
      res.status(404).json({ success: false, error: 'Preset type not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


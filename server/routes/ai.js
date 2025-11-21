const express = require('express');
const router = express.Router();
const {
  isAIEnabled,
  generateAITitles,
  generateAIScript,
  generateSEOSuggestions,
  generateThumbnailTexts
} = require('../services/ai');

// Check AI status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    enabled: isAIEnabled(),
    message: isAIEnabled() 
      ? 'AI features are enabled' 
      : 'AI features disabled. Add OPENAI_API_KEY to .env to enable.'
  });
});

// Generate AI titles
router.post('/titles', async (req, res) => {
  try {
    const { topic, count = 10, useAI = true } = req.body;
    
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    let titles = null;
    if (useAI && isAIEnabled()) {
      titles = await generateAITitles(topic, count);
    }

    res.json({
      success: true,
      titles: titles || [],
      aiEnabled: isAIEnabled(),
      aiUsed: !!titles
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate AI script
router.post('/script', async (req, res) => {
  try {
    const { topic, videoType = 'tutorial', duration = '10 minutes' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    if (!isAIEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'AI not enabled. Add OPENAI_API_KEY to .env'
      });
    }

    const script = await generateAIScript(topic, videoType, duration);
    
    if (script) {
      res.json({ success: true, script, aiUsed: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to generate script' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get SEO suggestions
router.post('/seo-suggestions', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    if (!isAIEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'AI not enabled. Add OPENAI_API_KEY to .env'
      });
    }

    const suggestions = await generateSEOSuggestions(title, description || '');
    
    if (suggestions) {
      res.json({ success: true, suggestions, aiUsed: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to generate suggestions' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate thumbnail text suggestions
router.post('/thumbnail-texts', async (req, res) => {
  try {
    const { topic, style = 'bold' } = req.body;
    
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    if (!isAIEnabled()) {
      return res.status(400).json({
        success: false,
        error: 'AI not enabled. Add OPENAI_API_KEY to .env'
      });
    }

    const texts = await generateThumbnailTexts(topic, style);
    
    if (texts) {
      res.json({ success: true, texts, aiUsed: true });
    } else {
      res.status(500).json({ success: false, error: 'Failed to generate texts' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


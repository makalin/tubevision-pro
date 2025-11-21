const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Get all video ideas
router.get('/', (req, res) => {
  try {
    const ideas = dbHelpers.getAllVideoIdeas();
    res.json({ success: true, ideas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add video idea
router.post('/', (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    const id = dbHelpers.addVideoIdea(title, description, category, priority);
    
    // Log activity
    dbHelpers.addActivity('idea_added', `New idea: ${title}`, `Category: ${category || 'general'}`);
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update video idea
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = dbHelpers.updateVideoIdea(id, updates);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Idea not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


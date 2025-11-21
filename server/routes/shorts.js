const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Generate hashtags for shorts
router.post('/generate', (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    // Generate optimized hashtags
    const baseTags = ['#shorts', '#viral', '#trending', '#fyp', '#youtube'];
    const topicTags = [
      `#${topic.replace(/\s+/g, '')}`,
      `#${topic.replace(/\s+/g, '').toLowerCase()}`,
      `#${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`
    ];

    // Add relevant category tags
    const categoryTags = getCategoryTags(topic);
    
    const allTags = [...new Set([...baseTags, ...topicTags, ...categoryTags])].slice(0, 15);

    // Log activity
    dbHelpers.addActivity.run('hashtags_generated', `Generated hashtags for: ${topic}`, `${allTags.length} tags`);

    res.json({ success: true, tags: allTags, tagString: allTags.join(' ') });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function getCategoryTags(topic) {
  const topicLower = topic.toLowerCase();
  const tags = [];
  
  if (topicLower.includes('cook') || topicLower.includes('food')) {
    tags.push('#cooking', '#foodie', '#recipe');
  }
  if (topicLower.includes('tech') || topicLower.includes('code')) {
    tags.push('#tech', '#coding', '#programming');
  }
  if (topicLower.includes('gaming') || topicLower.includes('game')) {
    tags.push('#gaming', '#gamer', '#games');
  }
  if (topicLower.includes('fitness') || topicLower.includes('workout')) {
    tags.push('#fitness', '#workout', '#gym');
  }
  
  return tags;
}

module.exports = router;


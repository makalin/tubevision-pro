const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { getTrendingKeywords, isYouTubeEnabled } = require('../services/youtube');

// Get all keywords
router.get('/', (req, res) => {
  try {
    const keywords = dbHelpers.getAllKeywords();
    res.json({ success: true, keywords });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Research keyword with real data when available
router.post('/research', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ success: false, error: 'Keyword is required' });
    }
    
    let searchVolume = 0;
    let competition = 'medium';
    let cpc = 0;
    let apiUsed = false;

    // Try to get real data from YouTube trending keywords
    if (isYouTubeEnabled()) {
      try {
        const trending = await getTrendingKeywords('US', 50);
        if (trending) {
          const keywordMatch = trending.find(k => 
            k.keyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(k.keyword.toLowerCase())
          );
          if (keywordMatch) {
            searchVolume = keywordMatch.count * 1000; // Estimate
            competition = keywordMatch.count > 5 ? 'high' : keywordMatch.count > 2 ? 'medium' : 'low';
            apiUsed = true;
          }
        }
      } catch (error) {
        console.error('Error fetching trending keywords:', error);
      }
    }

    // Fallback to simulated data if no real data available
    if (!apiUsed) {
      searchVolume = Math.floor(Math.random() * 100000) + 1000;
      competition = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
      cpc = (Math.random() * 5 + 0.5).toFixed(2);
    } else {
      cpc = (Math.random() * 3 + 0.5).toFixed(2);
    }
    
    const id = dbHelpers.saveKeyword(keyword, searchVolume, competition, parseFloat(cpc));
    
    res.json({
      success: true,
      keyword: {
        id,
        keyword,
        search_volume: searchVolume,
        competition,
        cpc: parseFloat(cpc),
        apiUsed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


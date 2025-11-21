const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { generateAITitles, isAIEnabled } = require('../services/ai');

// Generate titles with real algorithms + AI
router.post('/generate', async (req, res) => {
  try {
    const { topic, useAI = true } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, error: 'Topic is required' });
    }

    // Try AI first if enabled
    let aiTitles = null;
    if (useAI && isAIEnabled()) {
      aiTitles = await generateAITitles(topic, 10);
    }

    // Use AI titles if available, otherwise fallback to templates
    let templates = [];
    
    if (aiTitles && aiTitles.length > 0) {
      // Use AI-generated titles
      templates = aiTitles.map(title => ({
        pattern: title,
        score: calculateTitleScore(title)
      }));
    } else {
      // Fallback to template-based generation
      templates = [
      // Question-based templates
      {
        pattern: `Why ${topic} is Taking Over in 2025`,
        score: calculateTitleScore(`Why ${topic} is Taking Over in 2025`)
      },
      {
        pattern: `Is ${topic} Worth It in 2025? (Honest Review)`,
        score: calculateTitleScore(`Is ${topic} Worth It in 2025? (Honest Review)`)
      },
      {
        pattern: `What Nobody Tells You About ${topic}`,
        score: calculateTitleScore(`What Nobody Tells You About ${topic}`)
      },
      {
        pattern: `Can You Really Master ${topic}? (The Truth)`,
        score: calculateTitleScore(`Can You Really Master ${topic}? (The Truth)`)
      },
      
      // Guide templates
      {
        pattern: `The Ultimate Guide to ${topic} (Don't Miss This)`,
        score: calculateTitleScore(`The Ultimate Guide to ${topic} (Don't Miss This)`)
      },
      {
        pattern: `${topic}: The Complete Beginner's Guide`,
        score: calculateTitleScore(`${topic}: The Complete Beginner's Guide`)
      },
      {
        pattern: `How to ${topic} in 2025: Step-by-Step Tutorial`,
        score: calculateTitleScore(`How to ${topic} in 2025: Step-by-Step Tutorial`)
      },
      {
        pattern: `Master ${topic} in 30 Days: Full Course`,
        score: calculateTitleScore(`Master ${topic} in 30 Days: Full Course`)
      },
      
      // Challenge/Experiment templates
      {
        pattern: `I Tried ${topic} for 7 Days - Here's What Happened`,
        score: calculateTitleScore(`I Tried ${topic} for 7 Days - Here's What Happened`)
      },
      {
        pattern: `I Did ${topic} Every Day for 30 Days (Results)`,
        score: calculateTitleScore(`I Did ${topic} Every Day for 30 Days (Results)`)
      },
      {
        pattern: `Testing ${topic}: Does It Actually Work?`,
        score: calculateTitleScore(`Testing ${topic}: Does It Actually Work?`)
      },
      {
        pattern: `I Spent $1000 on ${topic} - Was It Worth It?`,
        score: calculateTitleScore(`I Spent $1000 on ${topic} - Was It Worth It?`)
      },
      
      // List templates
      {
        pattern: `Top 10 Secrets About ${topic}`,
        score: calculateTitleScore(`Top 10 Secrets About ${topic}`)
      },
      {
        pattern: `10 ${topic} Tips That Changed Everything`,
        score: calculateTitleScore(`10 ${topic} Tips That Changed Everything`)
      },
      {
        pattern: `5 ${topic} Mistakes Everyone Makes (Avoid These!)`,
        score: calculateTitleScore(`5 ${topic} Mistakes Everyone Makes (Avoid These!)`)
      },
      {
        pattern: `Top 7 ${topic} Tools You Need in 2025`,
        score: calculateTitleScore(`Top 7 ${topic} Tools You Need in 2025`)
      },
      
      // Warning/Problem templates
      {
        pattern: `Stop Doing ${topic} Wrong! (Costly Mistakes)`,
        score: calculateTitleScore(`Stop Doing ${topic} Wrong! (Costly Mistakes)`)
      },
      {
        pattern: `${topic} is Broken - Here's How to Fix It`,
        score: calculateTitleScore(`${topic} is Broken - Here's How to Fix It`)
      },
      {
        pattern: `The ${topic} Scam Nobody Talks About`,
        score: calculateTitleScore(`The ${topic} Scam Nobody Talks About`)
      },
      {
        pattern: `Why ${topic} Fails (And How to Succeed)`,
        score: calculateTitleScore(`Why ${topic} Fails (And How to Succeed)`)
      },
      
      // Explanation templates
      {
        pattern: `${topic} Explained: Everything You Need to Know`,
        score: calculateTitleScore(`${topic} Explained: Everything You Need to Know`)
      },
      {
        pattern: `How ${topic} Actually Works (Simple Explanation)`,
        score: calculateTitleScore(`How ${topic} Actually Works (Simple Explanation)`)
      },
      {
        pattern: `${topic} for Beginners: Start Here`,
        score: calculateTitleScore(`${topic} for Beginners: Start Here`)
      },
      
      // Success story templates
      {
        pattern: `How I Mastered ${topic} in 30 Days`,
        score: calculateTitleScore(`How I Mastered ${topic} in 30 Days`)
      },
      {
        pattern: `From Zero to Hero: My ${topic} Journey`,
        score: calculateTitleScore(`From Zero to Hero: My ${topic} Journey`)
      },
      {
        pattern: `How I Made $10K with ${topic} (Full Breakdown)`,
        score: calculateTitleScore(`How I Made $10K with ${topic} (Full Breakdown)`)
      },
      
      // Comparison templates
      {
        pattern: `${topic} vs Traditional Methods (Which is Better?)`,
        score: calculateTitleScore(`${topic} vs Traditional Methods (Which is Better?)`)
      },
      {
        pattern: `Best ${topic} Tools Compared (2025 Review)`,
        score: calculateTitleScore(`Best ${topic} Tools Compared (2025 Review)`)
      },
      
      // Reveal templates
      {
        pattern: `The Truth About ${topic} (Industry Secrets)`,
        score: calculateTitleScore(`The Truth About ${topic} (Industry Secrets)`)
      },
      {
        pattern: `${topic} Secrets They Don't Want You to Know`,
        score: calculateTitleScore(`${topic} Secrets They Don't Want You to Know`)
      },
      {
        pattern: `I Exposed the ${topic} Industry (Shocking Truth)`,
        score: calculateTitleScore(`I Exposed the ${topic} Industry (Shocking Truth)`)
      },
      
      // Trend templates
      {
        pattern: `${topic} is the Future (Here's Why)`,
        score: calculateTitleScore(`${topic} is the Future (Here's Why)`)
      },
      {
        pattern: `Why Everyone is Switching to ${topic} in 2025`,
        score: calculateTitleScore(`Why Everyone is Switching to ${topic} in 2025`)
      }
      ];
    }

    // Sort by score
    templates.sort((a, b) => b.score - a.score);

    // Save to database
    const savedTitles = templates.map(t => {
      const id = uuidv4();
      dbHelpers.saveTitle(id, topic, t.pattern, t.score);
      return { id, title: t.pattern, score: t.score };
    });

    // Update dashboard stats
    const stats = dbHelpers.getStats.get();
    dbHelpers.updateStats.run(
      stats.total_views,
      stats.ctr,
      stats.revenue,
      (stats.titles_generated || 0) + savedTitles.length,
      stats.scripts_created,
      stats.thumbnails_created
    );

    // Log activity
    dbHelpers.addActivity.run('title_generated', `Generated ${savedTitles.length} titles`, `Topic: ${topic}`);

    // Broadcast
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'titles_generated',
        data: { topic, count: savedTitles.length }
      });
    }

    res.json({ 
      success: true, 
      titles: savedTitles,
      aiEnabled: isAIEnabled(),
      aiUsed: !!aiTitles && aiTitles.length > 0
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get title history
router.get('/history', (req, res) => {
  try {
    const { topic } = req.query;
    const titles = topic 
      ? dbHelpers.getTitlesByTopic.all(`%${topic}%`)
      : dbHelpers.getTitlesByTopic.all('%%');
    
    res.json({ success: true, titles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Calculate title score based on real metrics
function calculateTitleScore(title) {
  let score = 50; // Base score
  
  // Length check (30-60 chars is optimal)
  const length = title.length;
  if (length >= 30 && length <= 60) score += 20;
  else if (length >= 20 && length < 30) score += 10;
  else if (length > 60 && length <= 70) score += 5;
  
  // Power words
  const powerWords = ['ultimate', 'complete', 'guide', 'secret', 'mistake', 'wrong', 'stop', 'why', 'how', 'top', 'best'];
  const powerWordCount = powerWords.filter(word => title.toLowerCase().includes(word)).length;
  score += powerWordCount * 5;
  
  // Numbers
  if (/\d+/.test(title)) score += 10;
  
  // Questions
  if (title.includes('?')) score += 8;
  
  // Emotional triggers
  const emotionalWords = ['amazing', 'incredible', 'shocking', 'revealed', 'exposed'];
  if (emotionalWords.some(word => title.toLowerCase().includes(word))) score += 7;
  
  // Brackets (proven to increase CTR)
  if (title.includes('(') && title.includes(')')) score += 12;
  
  // Cap at 100
  return Math.min(100, score);
}

module.exports = router;


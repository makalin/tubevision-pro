const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { v4: uuidv4 } = require('uuid');

// Run SEO audit
router.post('/audit', (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    const results = performSEOAudit(title || '', description || '', tags || '');
    const finalScore = results.reduce((sum, r) => sum + r.score, 0);
    const maxScore = results.reduce((sum, r) => sum + r.maxScore, 0);
    const scorePercentage = Math.round((finalScore / maxScore) * 100);

    // Save audit
    const id = uuidv4();
    dbHelpers.saveSEOAudit.run(
      id,
      title || '',
      description || '',
      tags || '',
      scorePercentage,
      JSON.stringify(results)
    );

    // Log activity
    dbHelpers.addActivity.run('seo_audit', `SEO Audit completed`, `Score: ${scorePercentage}/100`);

    // Broadcast
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'seo_audit',
        data: { score: scorePercentage }
      });
    }

    res.json({
      success: true,
      score: scorePercentage,
      results: results,
      id: id
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get audit history
router.get('/history', (req, res) => {
  try {
    const audits = dbHelpers.getSEOAudits.all();
    audits.forEach(a => {
      a.results = JSON.parse(a.results || '[]');
    });
    res.json({ success: true, audits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function performSEOAudit(title, description, tags) {
  const results = [];
  
  // Title Length (20 points)
  const titleLength = title.length;
  let titleScore = 0;
  let titleMessage = '';
  if (titleLength >= 30 && titleLength <= 60) {
    titleScore = 20;
    titleMessage = `Perfect length (${titleLength} chars)`;
  } else if (titleLength > 0 && titleLength < 30) {
    titleScore = 10;
    titleMessage = `Too short (${titleLength} chars). Aim for 30-60 characters.`;
  } else if (titleLength > 60 && titleLength <= 70) {
    titleScore = 15;
    titleMessage = `Too long (${titleLength} chars). May be truncated.`;
  } else if (titleLength > 70) {
    titleScore = 5;
    titleMessage = `Very long (${titleLength} chars). Will be truncated.`;
  } else {
    titleMessage = 'Title is required';
  }
  results.push({ name: 'Title Length', score: titleScore, maxScore: 20, status: titleScore >= 15 ? 'high' : titleScore >= 10 ? 'med' : 'low', message: titleMessage });

  // Description Length (20 points)
  const descLength = description.length;
  let descScore = 0;
  let descMessage = '';
  if (descLength >= 125 && descLength <= 5000) {
    descScore = 20;
    descMessage = `Good length (${descLength} chars)`;
  } else if (descLength > 0 && descLength < 125) {
    descScore = 10;
    descMessage = `Too short (${descLength} chars). Aim for 125+ characters.`;
  } else if (descLength > 5000) {
    descScore = 15;
    descMessage = `Very long (${descLength} chars). May be excessive.`;
  } else {
    descMessage = 'Description is recommended';
  }
  results.push({ name: 'Description Length', score: descScore, maxScore: 20, status: descScore >= 15 ? 'high' : descScore >= 10 ? 'med' : 'low', message: descMessage });

  // Tags Count (15 points)
  const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
  let tagScore = 0;
  let tagMessage = '';
  if (tagArray.length >= 5 && tagArray.length <= 15) {
    tagScore = 15;
    tagMessage = `Optimal tag count (${tagArray.length} tags)`;
  } else if (tagArray.length > 0 && tagArray.length < 5) {
    tagScore = 8;
    tagMessage = `Few tags (${tagArray.length}). Add more for better discoverability.`;
  } else if (tagArray.length > 15) {
    tagScore = 10;
    tagMessage = `Too many tags (${tagArray.length}). YouTube may ignore some.`;
  } else {
    tagMessage = 'Tags are recommended';
  }
  results.push({ name: 'Tags Count', score: tagScore, maxScore: 15, status: tagScore >= 12 ? 'high' : tagScore >= 8 ? 'med' : 'low', message: tagMessage });

  // Keyword Consistency (15 points)
  let keywordScore = 0;
  let keywordMessage = '';
  if (title && description) {
    const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const descWords = description.toLowerCase().split(/\s+/);
    const commonWords = titleWords.filter(word => descWords.includes(word));
    if (commonWords.length >= 2) {
      keywordScore = 15;
      keywordMessage = `Excellent keyword overlap (${commonWords.length} keywords)`;
    } else if (commonWords.length === 1) {
      keywordScore = 10;
      keywordMessage = `Good keyword overlap`;
    } else {
      keywordScore = 5;
      keywordMessage = 'Consider using keywords from title in description';
    }
  } else {
    keywordMessage = 'Need both title and description';
  }
  results.push({ name: 'Keyword Consistency', score: keywordScore, maxScore: 15, status: keywordScore >= 12 ? 'high' : keywordScore >= 8 ? 'med' : 'low', message: keywordMessage });

  // Call-to-Action (10 points)
  const ctaKeywords = ['subscribe', 'like', 'comment', 'share', 'watch', 'click', 'link', 'check', 'visit'];
  const hasCTA = ctaKeywords.some(keyword => description.toLowerCase().includes(keyword));
  const ctaScore = hasCTA ? 10 : 5;
  results.push({ name: 'Call-to-Action', score: ctaScore, maxScore: 10, status: hasCTA ? 'high' : 'med', message: hasCTA ? 'CTA found in description' : 'Consider adding a CTA (subscribe, like, etc.)' });

  // Engagement Signals (10 points)
  const questionMarks = (title + description).split('?').length - 1;
  const engagementScore = questionMarks > 0 ? 10 : 5;
  results.push({ name: 'Engagement Signals', score: engagementScore, maxScore: 10, status: questionMarks > 0 ? 'high' : 'med', message: questionMarks > 0 ? `Questions found (${questionMarks}) - good for engagement` : 'Consider adding questions to boost engagement' });

  // Timestamps (10 points)
  const hasTimestamp = /\d+:\d+/.test(description);
  const timestampScore = hasTimestamp ? 10 : 0;
  results.push({ name: 'Timestamps', score: timestampScore, maxScore: 10, status: hasTimestamp ? 'high' : 'low', message: hasTimestamp ? 'Timestamps found - improves user experience' : 'Consider adding timestamps for longer videos' });

  return results;
}

module.exports = router;


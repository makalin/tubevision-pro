const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Get revenue data
router.get('/', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const revenueData = dbHelpers.getRevenueData(startDate, endDate);
    
    // Calculate totals
    const total = revenueData.reduce((sum, r) => sum + (r.revenue || 0), 0);
    const bySource = revenueData.reduce((acc, r) => {
      acc[r.source] = (acc[r.source] || 0) + (r.revenue || 0);
      return acc;
    }, {});
    
    res.json({ success: true, revenue: revenueData, total, bySource });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Calculate revenue estimate
router.post('/calculate', (req, res) => {
  try {
    const { views, cpm, rpm } = req.body;
    const viewsNum = parseFloat(views) || 0;
    const cpmNum = parseFloat(cpm) || 2.5; // Default CPM
    const rpmNum = parseFloat(rpm) || 2.0; // Default RPM
    
    // Revenue calculation
    const estimatedRevenue = (viewsNum / 1000) * rpmNum;
    const estimatedCPM = cpmNum;
    
    res.json({
      success: true,
      estimated_revenue: estimatedRevenue.toFixed(2),
      estimated_cpm: estimatedCPM,
      views: viewsNum
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add revenue data
router.post('/', (req, res) => {
  try {
    const { date, revenue, source, video_id } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, error: 'Date is required' });
    }
    
    const id = dbHelpers.addRevenueData(date, revenue, source, video_id);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


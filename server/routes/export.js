const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Export all data
router.get('/', (req, res) => {
  try {
    const exportData = {
      export_date: new Date().toISOString(),
      version: '2.0',
      data: db
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=tubevision-export.json');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Import data
router.post('/', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: 'Data is required' });
    }
    
    // Merge imported data (in production, add validation)
    Object.keys(data).forEach(key => {
      if (db[key] && Array.isArray(db[key])) {
        db[key] = [...db[key], ...(data[key] || [])];
      } else if (db[key] && typeof db[key] === 'object') {
        db[key] = { ...db[key], ...(data[key] || {}) };
      }
    });
    
    // Save to file
    const fs = require('fs');
    const path = require('path');
    const dbFile = path.join(__dirname, '../data/database.json');
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
    
    res.json({ success: true, message: 'Data imported successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


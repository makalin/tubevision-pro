const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

// Get calendar events
router.get('/', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const events = dbHelpers.getCalendarEvents(startDate, endDate);
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add calendar event
router.post('/', (req, res) => {
  try {
    const { title, date, time, type, video_id } = req.body;
    if (!title || !date) {
      return res.status(400).json({ success: false, error: 'Title and date are required' });
    }
    
    const id = dbHelpers.addCalendarEvent(title, date, time, type, video_id);
    
    // Log activity
    dbHelpers.addActivity('calendar_event', `Scheduled: ${title}`, `Date: ${date}`);
    
    // Broadcast
    if (req.app.locals.broadcast) {
      req.app.locals.broadcast({
        type: 'calendar_event',
        data: { id, title, date }
      });
    }
    
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


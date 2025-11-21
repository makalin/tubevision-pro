const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFile = path.join(dataDir, 'database.json');

// Sample data for examples
const sampleData = {
  video_ideas: [
    { id: 'sample-1', title: '10 JavaScript Tips Every Developer Should Know', description: 'Share practical tips for JavaScript developers', category: 'tutorial', priority: 'high', status: 'pending', votes: 0, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'sample-2', title: 'React vs Vue: Which Framework is Better in 2025?', description: 'Comprehensive comparison of popular frameworks', category: 'review', priority: 'medium', status: 'pending', votes: 0, created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 'sample-3', title: 'Building My First SaaS Product - Day by Day', description: 'Document the journey of building a SaaS product', category: 'general', priority: 'high', status: 'pending', votes: 0, created_at: new Date(Date.now() - 259200000).toISOString() }
  ],
  keyword_research: [
    { id: 'kw-1', keyword: 'javascript tutorial', search_volume: 45000, competition: 'high', cpc: 2.50, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'kw-2', keyword: 'react hooks', search_volume: 28000, competition: 'medium', cpc: 1.80, created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: 'kw-3', keyword: 'web development', search_volume: 120000, competition: 'high', cpc: 3.20, created_at: new Date(Date.now() - 259200000).toISOString() }
  ]
};

// Initialize database
let db = {
  users: [],
  activities: [],
  scripts: [],
  titles: [],
  thumbnails: [],
  competitors: [],
  seo_audits: [],
  video_ideas: [...sampleData.video_ideas],
  content_calendar: [],
  videos: [],
  analytics: [],
  revenue_data: [],
  keyword_research: [...sampleData.keyword_research],
  dashboard_stats: {
    total_views: 0,
    ctr: 0,
    revenue: 0,
    titles_generated: 0,
    scripts_created: 0,
    thumbnails_created: 0,
    updated_at: new Date().toISOString()
  }
};

// Load database from file
function loadDB() {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf8');
      const loadedDb = JSON.parse(data);
      // Merge sample data if database is empty
      if (!loadedDb.video_ideas || loadedDb.video_ideas.length === 0) {
        loadedDb.video_ideas = [...sampleData.video_ideas];
      }
      if (!loadedDb.keyword_research || loadedDb.keyword_research.length === 0) {
        loadedDb.keyword_research = [...sampleData.keyword_research];
      }
      db = loadedDb;
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Save database to file
function saveDB() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Initialize on load
loadDB();

// Helper functions
const dbHelpers = {
  // Activities
  addActivity: (type, title, description) => {
    db.activities.unshift({
      id: uuidv4(),
      type,
      title,
      description: description || '',
      timestamp: new Date().toISOString()
    });
    // Keep only last 100 activities
    if (db.activities.length > 100) {
      db.activities = db.activities.slice(0, 100);
    }
    saveDB();
  },

  getActivities: () => {
    return db.activities.slice(0, 50);
  },

  // Scripts
  saveScript: (id, hook, intro, content, cta, title) => {
    const existing = db.scripts.find(s => s.id === id);
    const script = {
      id: id || uuidv4(),
      hook: hook || '',
      intro: intro || '',
      content: content || '',
      cta: cta || '',
      title: title || 'Untitled Script',
      updated_at: new Date().toISOString()
    };
    
    if (existing) {
      Object.assign(existing, script);
    } else {
      script.created_at = new Date().toISOString();
      db.scripts.unshift(script);
    }
    saveDB();
    return script.id;
  },

  getScript: (id) => {
    return db.scripts.find(s => s.id === id);
  },

  getAllScripts: () => {
    return db.scripts;
  },

  // Titles
  saveTitle: (id, topic, title, score) => {
    db.titles.unshift({
      id: id || uuidv4(),
      topic,
      title,
      score,
      created_at: new Date().toISOString()
    });
    // Keep only last 500 titles
    if (db.titles.length > 500) {
      db.titles = db.titles.slice(0, 500);
    }
    saveDB();
  },

  getTitlesByTopic: (topicPattern) => {
    if (!topicPattern || topicPattern === '%%') {
      return db.titles.slice(0, 20);
    }
    const pattern = topicPattern.replace(/%/g, '').toLowerCase();
    return db.titles.filter(t => 
      t.topic.toLowerCase().includes(pattern)
    ).slice(0, 20);
  },

  // Thumbnails
  saveThumbnail: (id, name, settings, image_data) => {
    const existing = db.thumbnails.find(t => t.id === id);
    const thumbnail = {
      id: id || uuidv4(),
      name: name || 'Untitled Thumbnail',
      settings: settings || '{}',
      image_data: image_data || '',
      updated_at: new Date().toISOString()
    };
    
    if (existing) {
      Object.assign(existing, thumbnail);
    } else {
      thumbnail.created_at = new Date().toISOString();
      db.thumbnails.unshift(thumbnail);
    }
    saveDB();
    return thumbnail.id;
  },

  getThumbnail: (id) => {
    return db.thumbnails.find(t => t.id === id);
  },

  getAllThumbnails: () => {
    return db.thumbnails;
  },

  // Competitors
  saveCompetitor: (id, name, url, avg_views) => {
    const existing = db.competitors.find(c => c.id === id);
    const competitor = {
      id: id || uuidv4(),
      name,
      url: url || '',
      avg_views: avg_views || 0,
      updated_at: new Date().toISOString()
    };
    
    if (existing) {
      Object.assign(existing, competitor);
    } else {
      competitor.created_at = new Date().toISOString();
      db.competitors.push(competitor);
    }
    saveDB();
    return competitor.id;
  },

  getAllCompetitors: () => {
    return db.competitors.sort((a, b) => (b.avg_views || 0) - (a.avg_views || 0));
  },

  // SEO Audits
  saveSEOAudit: (id, title, description, tags, score, results) => {
    db.seo_audits.unshift({
      id: id || uuidv4(),
      title: title || '',
      description: description || '',
      tags: tags || '',
      score,
      results: results || '[]',
      created_at: new Date().toISOString()
    });
    // Keep only last 100 audits
    if (db.seo_audits.length > 100) {
      db.seo_audits = db.seo_audits.slice(0, 100);
    }
    saveDB();
  },

  getSEOAudits: () => {
    return db.seo_audits.slice(0, 20);
  },

  // Dashboard Stats
  updateStats: (total_views, ctr, revenue, titles_generated, scripts_created, thumbnails_created) => {
    db.dashboard_stats = {
      total_views: total_views || 0,
      ctr: ctr || 0,
      revenue: revenue || 0,
      titles_generated: titles_generated || 0,
      scripts_created: scripts_created || 0,
      thumbnails_created: thumbnails_created || 0,
      updated_at: new Date().toISOString()
    };
    saveDB();
  },

  getStats: () => {
    return db.dashboard_stats;
  },

  // Video Ideas
  addVideoIdea: (title, description, category, priority) => {
    const idea = {
      id: uuidv4(),
      title,
      description: description || '',
      category: category || 'general',
      priority: priority || 'medium',
      status: 'pending',
      votes: 0,
      created_at: new Date().toISOString()
    };
    db.video_ideas.unshift(idea);
    saveDB();
    return idea.id;
  },

  getAllVideoIdeas: () => {
    return db.video_ideas.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    });
  },

  updateVideoIdea: (id, updates) => {
    const idea = db.video_ideas.find(i => i.id === id);
    if (idea) {
      Object.assign(idea, updates, { updated_at: new Date().toISOString() });
      saveDB();
      return true;
    }
    return false;
  },

  // Content Calendar
  addCalendarEvent: (title, date, time, type, video_id) => {
    const event = {
      id: uuidv4(),
      title,
      date,
      time: time || '12:00',
      type: type || 'publish',
      video_id: video_id || null,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };
    db.content_calendar.push(event);
    db.content_calendar.sort((a, b) => new Date(a.date) - new Date(b.date));
    saveDB();
    return event.id;
  },

  getCalendarEvents: (startDate, endDate) => {
    if (!startDate || !endDate) {
      return db.content_calendar;
    }
    return db.content_calendar.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
    });
  },

  // Videos Library
  addVideo: (title, status, url, publish_date, views, likes, comments) => {
    const video = {
      id: uuidv4(),
      title,
      status: status || 'draft',
      url: url || '',
      publish_date: publish_date || null,
      views: views || 0,
      likes: likes || 0,
      comments: comments || 0,
      created_at: new Date().toISOString()
    };
    db.videos.unshift(video);
    saveDB();
    return video.id;
  },

  getAllVideos: () => {
    return db.videos;
  },

  updateVideo: (id, updates) => {
    const video = db.videos.find(v => v.id === id);
    if (video) {
      Object.assign(video, updates, { updated_at: new Date().toISOString() });
      saveDB();
      return true;
    }
    return false;
  },

  // Analytics
  addAnalytics: (video_id, date, views, watch_time, subscribers_gained) => {
    const analytics = {
      id: uuidv4(),
      video_id,
      date,
      views: views || 0,
      watch_time: watch_time || 0,
      subscribers_gained: subscribers_gained || 0,
      created_at: new Date().toISOString()
    };
    db.analytics.push(analytics);
    saveDB();
    return analytics.id;
  },

  getAnalytics: (startDate, endDate) => {
    let filtered = db.analytics;
    if (startDate && endDate) {
      filtered = db.analytics.filter(a => {
        const aDate = new Date(a.date);
        return aDate >= new Date(startDate) && aDate <= new Date(endDate);
      });
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Revenue Data
  addRevenueData: (date, revenueAmount, source, video_id) => {
    const revenueEntry = {
      id: uuidv4(),
      date,
      revenue: revenueAmount || 0,
      source: source || 'ads',
      video_id: video_id || null,
      created_at: new Date().toISOString()
    };
    db.revenue_data.push(revenueEntry);
    saveDB();
    return revenueEntry.id;
  },

  getRevenueData: (startDate, endDate) => {
    let filtered = db.revenue_data;
    if (startDate && endDate) {
      filtered = db.revenue_data.filter(r => {
        const rDate = new Date(r.date);
        return rDate >= new Date(startDate) && rDate <= new Date(endDate);
      });
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Keyword Research
  saveKeyword: (keyword, search_volume, competition, cpc) => {
    const existing = db.keyword_research.find(k => k.keyword === keyword);
    const keywordData = {
      id: uuidv4(),
      keyword,
      search_volume: search_volume || 0,
      competition: competition || 'medium',
      cpc: cpc || 0,
      updated_at: new Date().toISOString()
    };
    
    if (existing) {
      Object.assign(existing, keywordData);
    } else {
      keywordData.created_at = new Date().toISOString();
      db.keyword_research.push(keywordData);
    }
    saveDB();
    return keywordData.id;
  },

  getAllKeywords: () => {
    return db.keyword_research.sort((a, b) => (b.search_volume || 0) - (a.search_volume || 0));
  },

  // Users
  createUser: (email, passwordHash, name) => {
    const user = {
      id: uuidv4(),
      email,
      password: passwordHash,
      name: name || email.split('@')[0],
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.users.push(user);
    saveDB();
    return user;
  },

  getUserByEmail: (email) => {
    return db.users.find(u => u.email === email);
  },

  getUserById: (id) => {
    const user = db.users.find(u => u.id === id);
    if (user) {
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  getAllUsers: () => {
    return db.users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
  },

  updateUser: (id, updates) => {
    const user = db.users.find(u => u.id === id);
    if (user) {
      // Don't allow updating password through this method
      const { password, ...safeUpdates } = updates;
      Object.assign(user, safeUpdates, { updated_at: new Date().toISOString() });
      saveDB();
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  updateUserPassword: (id, passwordHash) => {
    const user = db.users.find(u => u.id === id);
    if (user) {
      user.password = passwordHash;
      user.updated_at = new Date().toISOString();
      saveDB();
      return true;
    }
    return false;
  },

  deleteUser: (id) => {
    const index = db.users.findIndex(u => u.id === id);
    if (index !== -1) {
      db.users.splice(index, 1);
      saveDB();
      return true;
    }
    return false;
  }
};

module.exports = { db, dbHelpers };

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Supported languages
const supportedLanguages = ['en', 'tr'];
const localesDir = path.join(__dirname, '../locales');

// Get translations for a language
router.get('/:lang', (req, res) => {
  try {
    const { lang } = req.params;
    
    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ 
        success: false, 
        error: `Language ${lang} not supported. Supported: ${supportedLanguages.join(', ')}` 
      });
    }
    
    const localeFile = path.join(localesDir, `${lang}.json`);
    
    if (!fs.existsSync(localeFile)) {
      return res.status(404).json({ success: false, error: 'Translation file not found' });
    }
    
    const translations = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    res.json({ success: true, translations, language: lang });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get list of supported languages
router.get('/', (req, res) => {
  try {
    res.json({ 
      success: true, 
      languages: supportedLanguages,
      default: 'en'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;


const axios = require('axios');
require('dotenv').config();

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Check if AI is enabled
function isAIEnabled() {
  return !!OPENAI_API_KEY;
}

// AI Title Generation using OpenAI
async function generateAITitles(topic, count = 10) {
  if (!isAIEnabled()) {
    return null; // Fallback to templates
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a YouTube title expert. Generate viral, high-CTR video titles. Return only titles, one per line, no numbering.'
          },
          {
            role: 'user',
            content: `Generate ${count} viral YouTube video titles about "${topic}". Make them engaging, click-worthy, and optimized for high click-through rates. Include power words, numbers, questions, and emotional triggers.`
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const titles = response.data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(title => title.length > 0)
      .slice(0, count);

    return titles;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return null;
  }
}

// AI Script Generation
async function generateAIScript(topic, videoType = 'tutorial', duration = '10 minutes') {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional YouTube script writer. Create engaging, well-structured video scripts with hooks, intros, content, and CTAs.'
          },
          {
            role: 'user',
            content: `Create a ${duration} YouTube video script about "${topic}" for a ${videoType} video. Include:
1. Hook (0:00-0:30) - Attention-grabbing opening
2. Intro (0:30-1:00) - Who you are, what they'll learn
3. Content - Main body with clear points
4. CTA - Call to action for engagement

Make it engaging, conversational, and optimized for viewer retention.`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return null;
  }
}

// AI SEO Suggestions
async function generateSEOSuggestions(title, description) {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a YouTube SEO expert. Provide actionable SEO improvement suggestions.'
          },
          {
            role: 'user',
            content: `Analyze this YouTube video metadata and provide 5 specific SEO improvement suggestions:

Title: ${title}
Description: ${description}

Provide suggestions in JSON format: {suggestions: ["suggestion1", "suggestion2", ...]}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, extract suggestions
      const suggestions = content.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 5);
      return { suggestions };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return null;
  }
}

// AI Thumbnail Text Suggestions
async function generateThumbnailTexts(topic, style = 'bold') {
  if (!isAIEnabled()) {
    return null;
  }

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a thumbnail design expert. Generate short, impactful text for YouTube thumbnails.'
          },
          {
            role: 'user',
            content: `Generate 5 short, impactful thumbnail text options for a video about "${topic}". Keep them under 3 words each, bold and attention-grabbing. Style: ${style}`
          }
        ],
        temperature: 0.9,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const texts = response.data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(text => text.length > 0 && text.length < 20)
      .slice(0, 5);

    return texts;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return null;
  }
}

module.exports = {
  isAIEnabled,
  generateAITitles,
  generateAIScript,
  generateSEOSuggestions,
  generateThumbnailTexts
};


const { google } = require('googleapis');
require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Check if YouTube API is enabled
function isYouTubeEnabled() {
  return !!YOUTUBE_API_KEY;
}

// Initialize YouTube API
function getYouTubeAPI() {
  if (!isYouTubeEnabled()) {
    return null;
  }
  return google.youtube({
    version: 'v3',
    auth: YOUTUBE_API_KEY
  });
}

// Get channel statistics
async function getChannelStats(channelId) {
  if (!isYouTubeEnabled()) {
    return null;
  }

  try {
    const youtube = getYouTubeAPI();
    const response = await youtube.channels.list({
      part: 'statistics,snippet',
      id: channelId
    });

    if (response.data.items && response.data.items.length > 0) {
      const channel = response.data.items[0];
      return {
        name: channel.snippet.title,
        subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
        viewCount: parseInt(channel.statistics.viewCount || 0),
        videoCount: parseInt(channel.statistics.videoCount || 0),
        thumbnail: channel.snippet.thumbnails.default.url
      };
    }
    return null;
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return null;
  }
}

// Get channel ID from URL
function extractChannelId(url) {
  // Handle different YouTube URL formats
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Search for channel by name
async function searchChannel(query) {
  if (!isYouTubeEnabled()) {
    return null;
  }

  try {
    const youtube = getYouTubeAPI();
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'channel',
      maxResults: 5
    });

    return response.data.items.map(item => ({
      channelId: item.id.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url
    }));
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return null;
  }
}

// Get video statistics
async function getVideoStats(videoId) {
  if (!isYouTubeEnabled()) {
    return null;
  }

  try {
    const youtube = getYouTubeAPI();
    const response = await youtube.videos.list({
      part: 'statistics,snippet',
      id: videoId
    });

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0];
      return {
        title: video.snippet.title,
        viewCount: parseInt(video.statistics.viewCount || 0),
        likeCount: parseInt(video.statistics.likeCount || 0),
        commentCount: parseInt(video.statistics.commentCount || 0),
        publishedAt: video.snippet.publishedAt
      };
    }
    return null;
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return null;
  }
}

// Get trending keywords
async function getTrendingKeywords(regionCode = 'US', maxResults = 10) {
  if (!isYouTubeEnabled()) {
    return null;
  }

  try {
    const youtube = getYouTubeAPI();
    const response = await youtube.videos.list({
      part: 'snippet',
      chart: 'mostPopular',
      regionCode: regionCode,
      maxResults: maxResults
    });

    const keywords = [];
    response.data.items.forEach(video => {
      if (video.snippet.tags) {
        keywords.push(...video.snippet.tags);
      }
    });

    // Count keyword frequency
    const keywordCount = {};
    keywords.forEach(keyword => {
      keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
    });

    return Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults)
      .map(([keyword, count]) => ({ keyword, count }));
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return null;
  }
}

module.exports = {
  isYouTubeEnabled,
  getChannelStats,
  extractChannelId,
  searchChannel,
  getVideoStats,
  getTrendingKeywords
};


const express = require('express');
const router = express.Router();
const { getPopularPosts, getLatestPosts } = require('../services/dataService');

// GET /posts - Get popular or latest posts
router.get('/', async (req, res) => {
  try {
    const type = req.query.type || 'latest';
    let posts;
    
    if (type === 'popular') {
      posts = await getPopularPosts();
    } else if (type === 'latest') {
      posts = await getLatestPosts();
    } else {
      return res.status(400).json({ error: 'Invalid post type. Use "popular" or "latest"' });
    }
    
    res.json({ posts });
  } catch (error) {
    console.error('Error in posts route:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
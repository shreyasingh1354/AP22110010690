const express = require('express');
const router = express.Router();
const { getTopUsers } = require('../services/dataService');

// GET /users - Get top users
router.get('/', async (req, res) => {
  try {
    const topUsers = await getTopUsers();
    res.json({ topUsers });
  } catch (error) {
    console.error('Error in users route:', error.message);
    res.status(500).json({ error: 'Failed to fetch top users' });
  }
});

module.exports = router;
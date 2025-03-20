const config = require('../config');
const { fetchAllUsers, fetchAllPosts } = require('./dataService');

// Cache store
const cache = {
  users: { data: null, timestamp: 0 },
  posts: { data: null, timestamp: 0 },
  postComments: {}, 
  userPosts: {} 
};


const isCacheValid = (key) => {
  return cache[key].data && (Date.now() - cache[key].timestamp < config.cache.ttl);
};


const getCacheData = (key) => {
  return cache[key].data;
};


const setCacheData = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};


const getUserPostsCache = (userId) => {
  return cache.userPosts[userId];
};


const setUserPostsCache = (userId, posts) => {
  cache.userPosts[userId] = {
    data: posts,
    timestamp: Date.now(),
    count: posts.length
  };
};


const getPostCommentsCache = (postId) => {
  return cache.postComments[postId];
};


const setPostCommentsCache = (postId, comments) => {
  cache.postComments[postId] = {
    data: comments,
    timestamp: Date.now(),
    count: comments.length
  };
};


const startCacheRefresh = () => {
  setInterval(async () => {
    try {
      console.log('Refreshing cache...');
      await fetchAllUsers();
      await fetchAllPosts();
      console.log('Cache refresh complete');
    } catch (error) {
      console.error('Error refreshing cache:', error.message);
    }
  }, config.cache.refreshInterval);
};

module.exports = {
  cache,
  isCacheValid,
  getCacheData,
  setCacheData,
  getUserPostsCache,
  setUserPostsCache,
  getPostCommentsCache,
  setPostCommentsCache,
  startCacheRefresh
};
const axios = require('axios');
const config = require('../config');
const { 
  isCacheValid, 
  getCacheData, 
  setCacheData,
  getUserPostsCache,
  setUserPostsCache,
  getPostCommentsCache,
  setPostCommentsCache
} = require('./cacheService');


async function fetchAllUsers() {
  if (isCacheValid('users')) {
    return getCacheData('users');
  }

  try {
    const response = await axios.get(`${config.testServer.baseUrl}/users`);
    const users = response.data.users;
  
    for (const userId in users) {
      await fetchUserPosts(userId);
    }
    
    setCacheData('users', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
}


async function fetchUserPosts(userId) {
  const cachedData = getUserPostsCache(userId);
  if (cachedData && (Date.now() - cachedData.timestamp < config.cache.ttl)) {
    return cachedData.data;
  }

  try {
    const response = await axios.get(`${config.testServer.baseUrl}/users/${userId}/posts`);
    const posts = response.data.posts;
    
    setUserPostsCache(userId, posts);
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.message);
    setUserPostsCache(userId, []);
    return [];
  }
}


async function fetchAllPosts() {
  if (isCacheValid('posts')) {
    return getCacheData('posts');
  }
  
  try {
   
    const users = await fetchAllUsers();
    let allPosts = [];
    
    for (const userId in users) {
      const userPosts = await fetchUserPosts(userId);
      allPosts = [...allPosts, ...userPosts];
    }
    
    setCacheData('posts', allPosts);
    return allPosts;
  } catch (error) {
    console.error('Error fetching all posts:', error.message);
    throw error;
  }
}


async function fetchPostComments(postId) {
  const cachedData = getPostCommentsCache(postId);
  if (cachedData && (Date.now() - cachedData.timestamp < config.cache.ttl)) {
    return cachedData.data;
  }

  try {
    const response = await axios.get(`${config.testServer.baseUrl}/posts/${postId}/comments`);
    const comments = response.data.comments;
    
    setPostCommentsCache(postId, comments);
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    setPostCommentsCache(postId, []);
    return [];
  }
}


async function getTopUsers(limit = 5) {
  const users = await fetchAllUsers();
  

  const usersArray = Object.entries(users).map(([userId, userName]) => {
    const cachedUserPosts = getUserPostsCache(userId);
    return {
      id: userId,
      name: userName,
      postCount: cachedUserPosts?.count || 0
    };
  });
  

  return usersArray.sort((a, b) => b.postCount - a.postCount).slice(0, limit);
}


async function getPopularPosts() {
  const allPosts = await fetchAllPosts();
  

  for (const post of allPosts) {
    if (!getPostCommentsCache(post.id)) {
      await fetchPostComments(post.id);
    }
  }
  

  const postsByComments = [...allPosts].sort((a, b) => {
    const commentCountA = getPostCommentsCache(a.id)?.count || 0;
    const commentCountB = getPostCommentsCache(b.id)?.count || 0;
    return commentCountB - commentCountA;
  });
  
 
  const maxCommentCount = getPostCommentsCache(postsByComments[0]?.id)?.count || 0;
  const popularPosts = postsByComments.filter(post => {
    return (getPostCommentsCache(post.id)?.count || 0) === maxCommentCount;
  });
  

  return popularPosts.map(post => ({
    ...post,
    commentCount: getPostCommentsCache(post.id)?.count || 0
  }));
}


async function getLatestPosts(limit = 5) {
  const allPosts = await fetchAllPosts();

  return [...allPosts].sort((a, b) => b.id - a.id).slice(0, limit);
}

module.exports = {
  fetchAllUsers,
  fetchUserPosts,
  fetchAllPosts,
  fetchPostComments,
  getTopUsers,
  getPopularPosts,
  getLatestPosts
};
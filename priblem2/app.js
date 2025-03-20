const express = require('express');
const cors = require('cors');
const { setupAxiosInterceptors } = require('./utils/api');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const { startCacheRefresh } = require('./services/cacheService');


const app = express();
const PORT = process.env.PORT || 3000;


setupAxiosInterceptors();


app.use(cors());
app.use(express.json());


app.use('/users', userRoutes);
app.use('/posts', postRoutes);


const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  

  startCacheRefresh();
});


process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
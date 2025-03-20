const axios = require('axios');
const config = require('../config');


const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(axiosConfig => {
    if (axiosConfig.url.includes(config.testServer.baseUrl)) {
      axiosConfig.headers['Authorization'] = `Bearer ${config.testServer.jwtToken}`;
    }
    return axiosConfig;
  });
};

module.exports = {
  setupAxiosInterceptors
};
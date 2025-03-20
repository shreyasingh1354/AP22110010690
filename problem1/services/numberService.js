const axios = require('axios');
const config = require('../config');

const fetchNumbersByType = async (numberType) => {
  try {
    const apiEndpoint = `${config.API_BASE_URL}/${config.NUMBER_TYPES[numberType]}`;
    
    // Set timeout to avoid long-running requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);
    
    const response = await axios.get(apiEndpoint, { 
      signal: controller.signal,
      timeout: config.REQUEST_TIMEOUT
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 200 && response.data && response.data.numbers) {
      return response.data.numbers;
    }
    
    return [];
  } catch (error) {
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      console.log('Request timed out');
    } else {
      console.error('Error fetching numbers:', error);
    }
    return [];
  }
};

module.exports = {
  fetchNumbersByType
};
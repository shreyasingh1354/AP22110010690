module.exports = {
    PORT: process.env.PORT || 9876,
    WINDOW_SIZE: 10,
    REQUEST_TIMEOUT: 1000,
    API_BASE_URL: 'http://20.244.56.144/test',
    NUMBER_TYPES: {
      p: 'primes',
      f: 'fibo',
      e: 'even',
      r: 'rand'
    }
  };
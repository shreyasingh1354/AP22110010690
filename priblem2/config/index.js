module.exports = {
  
    port: process.env.PORT || 3000,
    
 
    testServer: {
      baseUrl: 'http://20.244.56.144/test',
      jwtToken: process.env.JWT_TOKEN
    },
    

    cache: {
      ttl: 60 * 1000, 
      refreshInterval: 30 * 1000 
    }
  };
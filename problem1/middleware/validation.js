const config = require('../config');

const validateNumberType = (req, res, next) => {
  const { numberType } = req.params;
  
 
  if (!['p', 'f', 'e', 'r'].includes(numberType)) {
    return res.status(400).json({ 
      error: 'Invalid number type. Must be one of: p (prime), f (fibonacci), e (even), r (random)' 
    });
  }
  
  next();
};

module.exports = {
  validateNumberType
};
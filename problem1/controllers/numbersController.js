const numberService = require('../services/numberService');
const config = require('../config');

// Store for maintaining window of numbers for each type
const numberStore = {
  p: [],
  f: [],
  e: [],
  r: []
};

const getNumbersByType = async (req, res) => {
  const { numberType } = req.params;
  
  try {
    // Get the previous state of the window
    const windowPrevState = [...numberStore[numberType]];
    
    // Fetch new numbers from the API
    const fetchedNumbers = await numberService.fetchNumbersByType(numberType);
    
    if (!fetchedNumbers || fetchedNumbers.length === 0) {
      return res.status(200).json({
        windowPrevState: windowPrevState,
        windowCurrState: numberStore[numberType],
        numbers: [],
        avg: calculateAverage(numberStore[numberType])
      });
    }
    
    // Update the store with new unique numbers
    updateNumberStore(numberType, fetchedNumbers);
    
    // Calculate the average
    const avg = calculateAverage(numberStore[numberType]);
    
    // Return the response
    res.status(200).json({
      windowPrevState: windowPrevState,
      windowCurrState: numberStore[numberType],
      numbers: fetchedNumbers,
      avg: avg
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

// Helper function to update the number store
const updateNumberStore = (numberType, newNumbers) => {
  // Add only unique numbers
  const uniqueNewNumbers = newNumbers.filter(num => !numberStore[numberType].includes(num));
  
  // Update the store
  numberStore[numberType] = [...numberStore[numberType], ...uniqueNewNumbers];
  
  // Limit to window size
  if (numberStore[numberType].length > config.WINDOW_SIZE) {
    numberStore[numberType] = numberStore[numberType].slice(-config.WINDOW_SIZE);
  }
};

// Helper function to calculate average
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};

module.exports = {
  getNumbersByType
};
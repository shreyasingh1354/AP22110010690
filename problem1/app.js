const express = require('express');
const config = require('./config');
const numbersRoutes = require('./routes/numbers');

const app = express();
app.use(express.json());

// Register routes
app.use('/numbers', numbersRoutes);

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

module.exports = app;
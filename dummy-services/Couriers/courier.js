// creates and starts an express server
const express = require('express');
const cors = require('cors');
const { 
    DATA_DIR, 
    ORDERS_FILE, 
    AGENTS_FILE, 
    LOGS_FILE 
} = require('./constants');
const { writeJsonFile } = require('./utils');
const dispatchService = require('./services/dispatchService');
//const trackingService = require('./services/trackingService');

// Initialize the app
const app = express();
const PORT = 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/dispatch', dispatchService);
//app.use('/tracking', trackingService);

// Start the server
app.listen(PORT, () => {
    //initializeDataFiles();
    console.log(`Courier service running on port ${PORT}`);
});

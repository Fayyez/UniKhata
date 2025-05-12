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
const trackingService = require('./services/trackingService');

// Initialize the app
const app = express();
const PORT = 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data files if they don't exist
const initializeDataFiles = () => {
    const fs = require('fs');
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Initialize orders file
    if (!fs.existsSync(ORDERS_FILE)) {
        writeJsonFile(ORDERS_FILE, []);
    }

    // Initialize agents file with sample data
    if (!fs.existsSync(AGENTS_FILE)) {
        const sampleAgents = [
            { id: 'AG001', name: 'Ahmed Khan', phone: '+92 300 1234567', zone: 'Clifton' },
            { id: 'AG002', name: 'Fatima Ali', phone: '+92 301 2345678', zone: 'Defence' },
            { id: 'AG003', name: 'Usman Malik', phone: '+92 302 3456789', zone: 'Gulshan' },
            { id: 'AG004', name: 'Sana Ahmed', phone: '+92 303 4567890', zone: 'North Nazimabad' }
        ];
        writeJsonFile(AGENTS_FILE, sampleAgents);
    }

    // Initialize logs file
    if (!fs.existsSync(LOGS_FILE)) {
        writeJsonFile(LOGS_FILE, []);
    }
};

// Routes
app.use('/dispatch', dispatchService);
app.use('/tracking', trackingService);

// Start the server
app.listen(PORT, () => {
    initializeDataFiles();
    console.log(`Courier service running on port ${PORT}`);
});

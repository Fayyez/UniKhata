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
// Create a new order
app.post('/api/orders', (req, res) => {
    try {
        const order = dispatchService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get order status
app.get('/api/orders/:orderId/status', (req, res) => {
    try {
        const status = trackingService.getOrderStatus(req.params.orderId);
        res.json(status);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Get order history
app.get('/api/orders/:orderId/history', (req, res) => {
    try {
        const history = trackingService.getOrderHistory(req.params.orderId);
        res.json(history);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Check if order is cancelled
app.get('/api/orders/:orderId/cancellation', (req, res) => {
    try {
        const result = trackingService.checkOrderCancellation(req.params.orderId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Check if order is returned
app.get('/api/orders/:orderId/return', (req, res) => {
    try {
        const result = trackingService.checkOrderReturn(req.params.orderId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    initializeDataFiles();
    console.log(`Courier service running on port ${PORT}`);
});

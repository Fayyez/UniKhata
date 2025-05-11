const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
    ORDERS_FILE,
    AGENTS_FILE,
    LOGS_FILE,
    ORDER_STATUS,
    DELIVERY_TIME_ESTIMATES
} = require('./constants');

// File operations
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Data generation
const generateOrderId = () => `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;

const generateTrackingNumber = () => `TRK-${uuidv4().slice(0, 12).toUpperCase()}`;

const getRandomAgent = () => {
    const agents = readJsonFile(AGENTS_FILE);
    return agents[Math.floor(Math.random() * agents.length)];
};

const calculateEstimatedDeliveryTime = (serviceType, pickupZone, deliveryZone) => {
    const baseTime = DELIVERY_TIME_ESTIMATES[serviceType];
    // Add some randomness to the delivery time
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% to 120% of base time
    return Math.ceil(baseTime * randomFactor);
};

const shouldOrderBeReturnedOrCancelled = () => {
    return Math.random() < 0.3; // 30% chance
};

const getRandomStatus = (currentStatus) => {
    if (currentStatus === ORDER_STATUS.PENDING) {
        return shouldOrderBeReturnedOrCancelled() 
            ? ORDER_STATUS.CANCELLED 
            : ORDER_STATUS.IN_TRANSIT;
    } else if (currentStatus === ORDER_STATUS.IN_TRANSIT) {
        return shouldOrderBeReturnedOrCancelled()
            ? ORDER_STATUS.RETURNED
            : ORDER_STATUS.DELIVERED;
    }
    return currentStatus;
};

// Logging
const logShipmentEvent = (orderId, event, details) => {
    const logs = readJsonFile(LOGS_FILE);
    logs.push({
        timestamp: new Date().toISOString(),
        orderId,
        event,
        details
    });
    writeJsonFile(LOGS_FILE, logs);
};

module.exports = {
    readJsonFile,
    writeJsonFile,
    generateOrderId,
    generateTrackingNumber,
    getRandomAgent,
    calculateEstimatedDeliveryTime,
    getRandomStatus,
    logShipmentEvent
}; 
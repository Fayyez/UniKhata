const path = require('path');

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');

// Order statuses
const ORDER_STATUS = {
    PENDING: 'PENDING',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    RETURNED: 'RETURNED',
    CANCELLED: 'CANCELLED'
};

// Delivery zones in Karachi, Pakistan
const DELIVERY_ZONES = [
    'Clifton',
    'Defence',
    'Gulshan',
    'North Nazimabad',
    'Gulistan-e-Jauhar',
    'Malir',
    'Korangi',
    'Landhi',
    'Saddar',
    'Karimabad'
];

// Service types
const SERVICE_TYPES = {
    STANDARD: 'STANDARD',
    EXPRESS: 'EXPRESS',
    SAME_DAY: 'SAME_DAY'
};

// Delivery time estimates (in hours)
const DELIVERY_TIME_ESTIMATES = {
    STANDARD: 48,
    EXPRESS: 24,
    SAME_DAY: 6
};

// Error messages
const ERROR_MESSAGES = {
    ORDER_NOT_FOUND: 'Order not found',
    INVALID_ORDER_ID: 'Invalid order ID',
    INVALID_STATUS: 'Invalid status provided',
    INVALID_ZONE: 'Invalid delivery zone',
    INVALID_SERVICE_TYPE: 'Invalid service type'
};

module.exports = {
    DATA_DIR,
    ORDERS_FILE,
    AGENTS_FILE,
    LOGS_FILE,
    ORDER_STATUS,
    DELIVERY_ZONES,
    SERVICE_TYPES,
    DELIVERY_TIME_ESTIMATES,
    ERROR_MESSAGES
}; 
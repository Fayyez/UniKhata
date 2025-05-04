const { 
    ORDERS_FILE, 
    ORDER_STATUS, 
    DELIVERY_ZONES, 
    SERVICE_TYPES,
    ERROR_MESSAGES 
} = require('../constants');
const { 
    readJsonFile, 
    writeJsonFile, 
    generateOrderId, 
    generateTrackingNumber,
    getRandomAgent,
    calculateEstimatedDeliveryTime,
    logShipmentEvent
} = require('../utils');

const createOrder = (orderData) => {
    // Validate required fields
    if (!orderData.sender || !orderData.recipient || !orderData.package) {
        throw new Error('Missing required fields');
    }

    // Validate delivery zones
    if (!DELIVERY_ZONES.includes(orderData.pickupZone) || 
        !DELIVERY_ZONES.includes(orderData.deliveryZone)) {
        throw new Error(ERROR_MESSAGES.INVALID_ZONE);
    }

    // Validate service type
    if (!Object.values(SERVICE_TYPES).includes(orderData.serviceType)) {
        throw new Error(ERROR_MESSAGES.INVALID_SERVICE_TYPE);
    }

    const orders = readJsonFile(ORDERS_FILE);
    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber();
    const assignedAgent = getRandomAgent();
    const estimatedDeliveryTime = calculateEstimatedDeliveryTime(
        orderData.serviceType,
        orderData.pickupZone,
        orderData.deliveryZone
    );

    const newOrder = {
        orderId,
        trackingNumber,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        estimatedDeliveryTime,
        assignedAgent,
        ...orderData
    };

    orders.push(newOrder);
    writeJsonFile(ORDERS_FILE, orders);

    // Log the order creation
    logShipmentEvent(orderId, 'ORDER_CREATED', {
        trackingNumber,
        status: ORDER_STATUS.PENDING
    });

    return newOrder;
};

const getOrderById = (orderId) => {
    const orders = readJsonFile(ORDERS_FILE);
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
        throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }
    return order;
};

const updateOrderStatus = (orderId, newStatus) => {
    const orders = readJsonFile(ORDERS_FILE);
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex === -1) {
        throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
        throw new Error(ERROR_MESSAGES.INVALID_STATUS);
    }

    orders[orderIndex].status = newStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();
    writeJsonFile(ORDERS_FILE, orders);

    // Log the status update
    logShipmentEvent(orderId, 'STATUS_UPDATED', {
        newStatus,
        previousStatus: orders[orderIndex].status
    });

    return orders[orderIndex];
};

module.exports = {
    createOrder,
    getOrderById,
    updateOrderStatus
}; 
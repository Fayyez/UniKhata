const { 
    ORDERS_FILE, 
    LOGS_FILE, 
    ORDER_STATUS,
    ERROR_MESSAGES 
} = require('../constants');
const { 
    readJsonFile, 
    getRandomStatus,
    logShipmentEvent
} = require('../utils');

const getOrderStatus = (orderId) => {
    const orders = readJsonFile(ORDERS_FILE);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    // Simulate status updates for demonstration
    if (order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.IN_TRANSIT) {
        const newStatus = getRandomStatus(order.status);
        if (newStatus !== order.status) {
            order.status = newStatus;
            logShipmentEvent(orderId, 'STATUS_UPDATED', {
                newStatus,
                previousStatus: order.status
            });
        }
    }

    return {
        orderId: order.orderId,
        trackingNumber: order.trackingNumber,
        status: order.status,
        lastUpdated: order.updatedAt || order.createdAt,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        currentLocation: order.status === ORDER_STATUS.IN_TRANSIT 
            ? `In transit between ${order.pickupZone} and ${order.deliveryZone}`
            : order.status === ORDER_STATUS.DELIVERED
                ? order.deliveryZone
                : order.pickupZone
    };
};

const getOrderHistory = (orderId) => {
    const logs = readJsonFile(LOGS_FILE);
    return logs.filter(log => log.orderId === orderId);
};

const checkOrderCancellation = (orderId) => {
    const orders = readJsonFile(ORDERS_FILE);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return {
        isCancelled: order.status === ORDER_STATUS.CANCELLED,
        cancellationReason: order.status === ORDER_STATUS.CANCELLED 
            ? 'Order cancelled by customer' 
            : null
    };
};

const checkOrderReturn = (orderId) => {
    const orders = readJsonFile(ORDERS_FILE);
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        throw new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    return {
        isReturned: order.status === ORDER_STATUS.RETURNED,
        returnReason: order.status === ORDER_STATUS.RETURNED
            ? 'Recipient not available at delivery location'
            : null
    };
};

module.exports = {
    getOrderStatus,
    getOrderHistory,
    checkOrderCancellation,
    checkOrderReturn
}; 
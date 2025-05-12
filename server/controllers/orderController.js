import Order from '../models/Order.js';
import Store from '../models/Store.js';
import axios from 'axios';
import Product from '../models/Product.js';
import createEStoreObjects from '../utils/estoreFactory.js';
import DummyStore from '../integration/E-stores/DummyStore.js'; 
import DummyCourier from '../integration/Couriers/DummyCourier.js';

export const getOrders = async (req, res) => {
    try {
        const uid = req.user?._id;
        const sid = req.query?.sid; 
        let orders;
        if (uid && sid) {
            console.log("fetching all orders for this is the uid and sid", uid, sid);
            orders = await Order.find({ store: sid });
        } else if (uid) {
            orders = await Order.find({ addedBy: uid });
        } else if (sid) {
            orders = await Order.find({ store: sid });
        } else {
            orders = await Order.find();
        }
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json({ message: "Orders fetched successfully", orders: orders });
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { oid } = req.params;
        const order = await Order.findById(oid);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order fetched successfully", order: order });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

export const getNewOrders = async (req, res) => {
    try {
        const sid = req.query?.sid;
        console.log("this is the sid for fetching new orders", sid);
        if (!sid) {
            return res.status(400).json({ message: "Store ID is required" });
        }
        const store = await Store.findById(sid).populate('eCommerceIntegrations');
        console.log("this is the store found from db for new order:", store._id);
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        const integratedPlatforms = createEStoreObjects(store.eCommerceIntegrations);
        //console.log("this is the integrated platforms", integratedPlatforms);
        //console.log("this is the integrated platforms", integratedPlatforms);
        let ordersObjects = [];
        for (let i = 0; i < integratedPlatforms.length; i++) {
            // Fetch and store all products first
            // print of integratedPlatforms[i]
            console.log("iteration", integratedPlatforms[i] instanceof DummyStore);
            const platform = integratedPlatforms[i];
            //console.log("this is the platform", platform);
            await platform.getAllProducts(req.user, store, store.eCommerceIntegrations[i]);
            console.log("got all products from", platform.title);

            // Fetch and store all orders
            const orders = await platform.getOrders(store, store.eCommerceIntegrations[i]);
            console.log("got all orders from the ecom object");
            ordersObjects = ordersObjects.concat(orders);
        }
        res.status(200).json({ message: "Orders fetched successfully", orders: ordersObjects });
    } catch (error) {
        res.status(500).json({ message: "Error fetching new orders", error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { oid } = req.params;
        const { order } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(oid, order, { new: true, runValidators: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { oid } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(oid);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};

export const changeOrderStatus = async (req, res) => {
    try {
        const { oid } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(oid, { status }, { new: true, runValidators: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

async function getAllProducts(user, store) {
    try {
        // Fetch products from dummy service
        const response = await axios.get('http://localhost:PORT/products'); // Replace PORT with actual port
        const products = response.data;

        for (const prod of products) {
            // Check if product already exists
            const existing = await Product.findOne({ name: prod.name, store: store._id });
            if (!existing) {
                await Product.create({
                    name: prod.name,
                    price: prod.price,
                    tag: prod.tag,
                    description: prod.description,
                    brand: prod.brand,
                    stockAmount: prod.stockAmount,
                    addedBy: user._id,
                    store: store._id
                });
            }
        }
        return { success: true };
    } catch (err) {
        console.error('Error in getAllProducts:', err);
        return { success: false, error: err.message };
    }
}

export const dispatchOrder = async (req, res) => {
    try {
        const { oid, sid } = req.body;
        const user = req.user;

        if (!oid || !sid) {
            return res.status(400).json({ message: "Order ID and Store ID are required" });
        }

        // Fetch the order from database
        const order = await Order.findById(oid);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: "Order must be in pending status to be dispatched" });
        }

        // Fetch the store and populate courier integrations
        const store = await Store.findById(sid).populate('courierIntegrations').populate('eCommerceIntegrations');
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }

        if (!store.courierIntegrations || store.courierIntegrations.length === 0) {
            return res.status(400).json({ message: "No courier integrations found for this store" });
        }

        // Import the courier factory function
        const createCourierObjects = (await import('../utils/courierFactory.js')).default;
        // Create courier objects using the factory
        const courierObjects = createCourierObjects(store.courierIntegrations);
        
        if (courierObjects.length === 0) {
            console.log("no courier objects found");
            return res.status(400).json({ message: "Failed to create courier objects" });
        }
        const mydummy_courier = courierObjects[0];
        console.log("this is the mydummy_courier", mydummy_courier instanceof DummyCourier);
        // Dispatch the order using the courier
        const dispatchResult = await mydummy_courier.dispatch(order);
        if (!dispatchResult.success) {
            return res.status(500).json({ message: "Failed to dispatch order bacause courier service is offline", error: dispatchResult.message });
        }
        // Update the order status to 'dispatched' or similar
        order.status = 'dispatched';
        order.courier = store.courierIntegrations[0]._id; // Set the courier used
        await order.save();
        
        res.status(200).json({ 
            message: "Order dispatched successfully", 
            order: order, 
            dispatchDetails: dispatchResult 
        });
    } catch (error) {
        console.error("Error dispatching order:", error);
        res.status(500).json({ message: "Error dispatching order", error: error.message });
    }
};

// Get analytics for orders: total orders, total sales, top 3 products by quantity sold
export const getOrderAnalytics = async (req, res) => {
    try {
        const sid = req.params?.sid;
        if (!sid) {
            return res.status(400).json({ message: "Store ID is required" });
        }
        // Fetch all orders for the store (excluding deleted)
        const orders = await Order.find({ store: sid, isDeleted: false });
        const totalOrders = orders.length;
        let totalSales = 0;
        const productSalesMap = new Map(); // productId -> { name, sold, sales }
        const productQuantityMap = new Map(); // productId -> total quantity

        // First, accumulate sold quantity for each product
        for (const order of orders) {
            totalSales += order.subtotal || 0;
            for (const entry of order.productEntries) {
                if (!entry.product) continue;
                const pid = entry.product.toString();
                if (!productSalesMap.has(pid)) {
                    productSalesMap.set(pid, {
                        productId: pid,
                        name: entry.name,
                        sold: 0,
                        sales: 0,
                    });
                }
                const prodStats = productSalesMap.get(pid);
                prodStats.sold += entry.quantity;
                // Track total quantity for price calculation
                productQuantityMap.set(pid, (productQuantityMap.get(pid) || 0) + entry.quantity);
            }
        }

        // Fetch product prices for all involved products
        const allProductIds = Array.from(productSalesMap.keys());
        const Product = (await import('../models/Product.js')).default;
        const products = await Product.find({ _id: { $in: allProductIds } });
        const priceMap = new Map(); // productId -> price
        for (const prod of products) {
            priceMap.set(prod._id.toString(), prod.price);
        }

        // Calculate sales for each product
        for (const [pid, prodStats] of productSalesMap.entries()) {
            const price = priceMap.get(pid);
            const quantity = productQuantityMap.get(pid) || 0;
            prodStats.sales = typeof price === 'number' ? price * quantity : 0;
        }

        // Get top 3 products by sold
        const topProducts = Array.from(productSalesMap.values())
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 3);

        res.status(200).json({
            totalOrders,
            totalSales,
            topProducts,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order analytics", error: error.message });
    }
};
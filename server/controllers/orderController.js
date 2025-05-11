import Order from '../models/Order.js';
import Store from '../models/Store.js';
import User from '../models/user.js'
import axios from 'axios';
import Product from '../models/Product.js';

export const getOrders = async (req, res) => {
    try {
        const uid = req.body?.uid;
        const sid = req.body?.sid;
        let orders;
        if (uid && sid) {
            orders = await Order.find({ addedBy: uid, store: sid });
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
        const sid = req.body.sid;
        const store = await Store.findById(sid).populate('eCommerceIntegrations');
        const user = await User.findById(req.user?._id)
        if (!store) {
            return res.status(404).json({ message: "Store not found" });
        }
        const integratedPlatforms = fetchEStores(store.eCommerceIntegrations);
        let ordersObjects = [];
        for (let i = 0; i < integratedPlatforms.length; i++) {
            // Fetch and store all products first
            const platform = integratedPlatforms[i];
            await platform.getAllProducts(user, store);
            // Fetch and store all orders
            const orders = await platform.getOrders(store, store.eCommerceIntegrations[i]);
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

async function fetchEStores(eCommerceIntegrations) {
    // Implementation of fetchEStores function
}

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

async function getOrders(user, store, platform) {
    try {
        // Fetch orders from dummy service
        const response = await axios.get('http://localhost:PORT/orders'); // Replace PORT with actual port
        const orders = response.data;

        const createdOrders = [];
        for (const order of orders) {
            // For each product in the order, find it in the local DB
            const productEntries = [];
            for (const prod of order.summary.products) {
                const productDoc = await Product.findOne({ name: prod.name, store: store._id });
                if (productDoc) {
                    productEntries.push({
                        product: productDoc._id,
                        quantity: prod.quantity
                    });
                }
            }

            // Check if order already exists (by orderid)
            const existingOrder = await Order.findOne({ orderid: order.id, store: store._id });
            if (!existingOrder) {
                const newOrder = await Order.create({
                    productEntries,
                    store: store._id,
                    platform: platform._id,
                    orderid: order.id,
                    delivery_address: order.summary.deliveryAddress,
                    subtotal: order.summary.totalSubtotal
                });
                createdOrders.push(newOrder);
            }
        }
        return createdOrders;
    } catch (err) {
        console.error('Error in getOrders:', err);
        return [];
    }
}
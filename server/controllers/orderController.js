import Order from '../models/Order.js';
import Store from '../models/Store.js';
import User from '../models/User.js';
import axios from 'axios';
import Product from '../models/Product.js';

export const getOrders = async (req, res) => {
    try {
        const uid = req.query?.uid;
        const sid = req.query?.sid; 
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
        const sid = req.query?.sid;
        if (!sid) {
            return res.status(400).json({ message: "Store ID is required" });
        }
        const store = await Store.findById(sid);
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
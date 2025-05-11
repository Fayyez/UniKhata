import Order from '../models/Order.js';
import Store from '../models/Store.js';
import axios from 'axios';
import Product from '../models/Product.js';
import createEStoreObjects from '../utils/estoreFactory.js';
import DummyStore from '../integration/E-stores/DummyStore.js'; 
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
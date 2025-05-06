import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library

const productEntrySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // required to be filled
    quantity: { type: Number, required: true }, // required to be filled
}, { _id: false });

const orderSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    orderId: { type: String, required: true, unique: true, default: uuidv4 }, // Generate a unique id by default
    productEntries: [productEntrySchema], // required to be filled
    platform:  { type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration', required: true }, // required to be filled
    courier: { type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' }, // required to be filled
    status: { type: String, required: true }, // required to be filled
});
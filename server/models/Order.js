import mongoose from "mongoose";

// TODO: schema yet to be implemented for order
const orderSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
});
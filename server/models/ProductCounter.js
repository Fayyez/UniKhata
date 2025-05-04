import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, unique: true },
    lastProductId: { type: Number, default: 0 }
});

module.exports = mongoose.model('ProductCounter', counterSchema);
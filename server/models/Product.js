import mongoose from "mongoose";

const thirdPartyTagSchema = new mongoose.Schema({
    integration: { type: mongoose.Schema.Types.ObjectId, ref: 'EcommerceIntegration', required: true },
    thirdPartyProductId: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    localProductId: { type: String, required: true },
    tag: { type: String },
    name: { type: String, required: true },
    description: String,
    brand: { type: String, default: "" },
    priceUSD: { type: Number, required: true },
    inStock: { type: Number, default: 0 },
    thirdPartyProductTags: [thirdPartyTagSchema],
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    image: { type: String, default: "" }
});
// for unique constraints on the product
productSchema.index({ store: 1, name: 1 }, { unique: true });
productSchema.index({ store: 1, localProductId: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);

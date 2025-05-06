import mongoose from "mongoose";

const thirdPartyTagSchema = new mongoose.Schema({
    integration: { type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration', required: true },
    thirdPartyProductId: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    pid: { type: String, required: true }, // required to be filled, auto-incremented
    name: { type: String, required: true }, // required to be filled
    price: { type: Number, required: true }, // required to be filled
    tag: { type: String },
    description: String,
    brand: { type: String, default: "" },
    inStock: { type: Number, default: 0 },
    thirdPartyProductTags: [thirdPartyTagSchema],
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
    image: { type: String, default: "" }
});

// for unique constraints on the product
productSchema.index({ store: 1, name: 1 }, { unique: true });
productSchema.index({ store: 1, pid: 1 }, { unique: true });
productSchema.index({ store: 1, isDeleted: 1 });

export default mongoose.model('Product', productSchema);

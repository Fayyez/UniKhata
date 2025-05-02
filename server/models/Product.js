// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
    name: String,
    description: String,
    priceUSD: Number,
    stock: Number,
    localProductId: String,
    thirdPartyProductTags: [
    {
        integration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EcommerceIntegration",
        },
        thirdPartyTag: String,
    },
    ],
});

module.exports = mongoose.model("Product", productSchema);

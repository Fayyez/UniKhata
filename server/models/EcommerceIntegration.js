import mongoose from "mongoose";

const ecommerceIntegrationSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    title: String,
    platform: String,// from the ../utils/constants.js
    email: String,
    apiEndpoint: String,
    token: String,
});

export default mongoose.model('EcommerceIntegration', ecommerceIntegrationSchema);

import mongoose from "mongoose";

const courierIntegrationSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    title: String,
    courierName: String, // from "../utils/constants.js"
    emailOrCredential: String,
    apiEndpoint: String,
    token: String
});

module.exports = mongoose.model('CourierIntegration', courierIntegrationSchema);
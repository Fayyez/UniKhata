import mongoose from "mongoose";
import { DUMMY_STORE } from "../utils/constants.js";

const eCommerceIntegrationSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    title: String,
    platform: { type: String, default: DUMMY_STORE }, // from the ../utils/constants.js
    email: String,
    apiEndpoint: String,
    token: String,
});

export default mongoose.model('ECommerceIntegration', eCommerceIntegrationSchema);
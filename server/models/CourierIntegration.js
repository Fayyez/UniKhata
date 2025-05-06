import mongoose from "mongoose";
import { DUMMY_COURIER } from "../utils/constants.js";

const courierIntegrationSchema = new mongoose.Schema({
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    title: String,
    courierName: { type: String, default: DUMMY_COURIER }, // from "../utils/constants.js"
    emailOrCredential: String,
    apiEndpoint: String,
    token: String
});

export default mongoose.model('CourierIntegration', courierIntegrationSchema);
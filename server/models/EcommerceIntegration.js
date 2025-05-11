import mongoose from "mongoose";
import { DUMMY_STORE } from "../utils/constants.js";

const eCommerceIntegrationSchema = new mongoose.Schema({
    store: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Store' 
    },
    title: String, // title of the eCommerce integration
    platform: { 
        type: mongoose.Schema.Types.String, default: DUMMY_STORE 
    }, // from the ../utils/constants.js
    email: mongoose.Schema.Types.String, // email associated with the integration
    apiEndpoint: mongoose.Schema.Types.String, // API endpoint for the integration
    token: mongoose.Schema.Types.String, // authentication token for the API
}, { timestamps: true } // adds operational timestamps to the schema
);

export default mongoose.model('ECommerceIntegration', eCommerceIntegrationSchema);
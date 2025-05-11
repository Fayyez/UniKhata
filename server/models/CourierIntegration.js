import mongoose from "mongoose";
import { DUMMY_COURIER } from "../utils/constants.js";

const courierIntegrationSchema = new mongoose.Schema({
    store: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Store' 
    },
    title: String,
    courierName: { 
        type: String, default: DUMMY_COURIER 
    }, // from "../utils/constants.js"
    emailOrCredential: mongoose.Schema.Types.String,
    apiEndpoint: mongoose.Schema.Types.String,
    token: mongoose.Schema.Types.String
}, { timestamps: true } // adds operational timestamps to the schema
);

export default mongoose.model('CourierIntegration', courierIntegrationSchema);
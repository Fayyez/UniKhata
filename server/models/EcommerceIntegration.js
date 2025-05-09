import mongoose from "mongoose";
import { DUMMY_STORE } from "../utils/constants.js";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const eCommerceIntegrationSchema = new mongoose.Schema({
    _id: { // eCommerce integration id
        type: Number, unique: true 
    },
    store: { 
        type: Number, ref: 'Store' 
    },
    title: String, // title of the eCommerce integration
    platform: { 
        type: String, default: DUMMY_STORE 
    }, // from the ../utils/constants.js
    email: String, // email associated with the integration
    apiEndpoint: String, // API endpoint for the integration
    token: String, // authentication token for the API
}, { timestamps: true } // adds operational timestamps to the schema
);

eCommerceIntegrationSchema.plugin(AutoIncrement, { id: 'ecommerce_integration_id_counter', inc_field: '_id' }); // for auto incrementing the eCommerce integration id

export default mongoose.model('ECommerceIntegration', eCommerceIntegrationSchema);
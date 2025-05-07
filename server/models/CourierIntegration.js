import mongoose from "mongoose";
import { DUMMY_COURIER } from "../utils/constants.js";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const courierIntegrationSchema = new mongoose.Schema({
    _id: { // courier integration id    
        type: Number, unique: true 
    },
    store: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Store' 
    },
    title: String,
    courierName: { 
        type: String, default: DUMMY_COURIER 
    }, // from "../utils/constants.js"
    emailOrCredential: String,
    apiEndpoint: String,
    token: String
});

courierIntegrationSchema.plugin(AutoIncrement, { id: 'courier_integration_id_counter', inc_field: '_id' }); // for auto incrementing the courier integration id

export default mongoose.model('CourierIntegration', courierIntegrationSchema);
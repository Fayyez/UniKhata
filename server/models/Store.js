import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const storeSchema = new mongoose.Schema({
    _id: { // store id
        type: Number, unique: true
    },
    name: { // store name
        type: String, required: true 
    },
    owner: { // store owner id
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    eCommerceIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration' }], // eCommerce integrations linked to the store
    courierIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' }], // courier integrations linked to the store
    isDeleted: { // store is deleted or not
        type: Boolean, default: false 
    },
}, { timestamps: true } // adds operational timestamps to the schema
);

storeSchema.plugin(AutoIncrement, { id: 'store_id_counter', inc_field: '_id' }); // for auto incrementing the store id

export default mongoose.model('Store', storeSchema);

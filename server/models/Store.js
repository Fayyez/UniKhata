import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    name: { // store name
        type: mongoose.Schema.Types.String, required: true 
    },
    owner: { // store owner id
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    eCommerceIntegrations: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration' 
    }], // eCommerce integrations linked to the store
    courierIntegrations: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' 
    }], // courier integrations linked to the store
    isDeleted: { // store is deleted or not
        type: mongoose.Schema.Types.Boolean, default: false 
    },
}, { timestamps: true } // adds operational timestamps to the schema
);

export default mongoose.model('Store', storeSchema);

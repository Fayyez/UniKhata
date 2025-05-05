import mongoose from 'mongoose';
import ProductCounter
 from './ProductCounter';
const storeSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    ecommerceIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EcommerceIntegration' }],
    courierIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' }],
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    lastEditedAt: { type: Date, default: Date.now },
    productCounter: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCounter' },
});

export default mongoose.model('Store', storeSchema);

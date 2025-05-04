import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    ecommerceIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EcommerceIntegration' }],
    courierIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' }],
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
});

export default mongoose.model('Store', storeSchema);

import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    sid: {type: String, required: true, unique: true}, // required to be filled, auto-incremented
    name: { type: String, required: true }, // required to be filled
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eCommerceIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration' }],
    courierIntegrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' }],
    createdAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    lastEditedAt: { type: Date, default: Date.now },
    productCounter: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCounter' },
});

export default mongoose.model('Store', storeSchema);

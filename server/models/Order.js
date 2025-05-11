import mongoose from "mongoose";

const productEntrySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // required to be filled
    quantity: { type: Number, required: true }, // required to be filled
}, { _id: false });

const orderSchema = new mongoose.Schema({
    productEntries: [productEntrySchema], // entries of products in the order
    store: { // store id
        type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true 
    }, 
    platform:  { // eCommerce platform id
        type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration', required: true 
    },
    courier: { // courier id
        type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration' 
    },
    isDeleted: { // order is deleted or not
        type: mongoose.Schema.Types.Boolean, default: false 
    },
    status: { // order status
        type: mongoose.Schema.Types.String, required: true 
    },
}, { timestamps: true } // adds operational timestamps to the schema
);

export default mongoose.model('Order', orderSchema);
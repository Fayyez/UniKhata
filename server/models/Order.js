import mongoose from "mongoose";

const productEntrySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // required to be filled
    name: { type: String, required: true },
    quantity: { type: Number, required: true }, // required to be filled
}, { _id: false });

const orderSchema = new mongoose.Schema({
    productEntries: [productEntrySchema], // entries of products in the order
    store: { // store id
        type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true
    },
    platform:  { // eCommerce platform id
        type: String, required: true
    },
    orderid: {
        type: String, unique: true, required: true
    },
    courier: { // courier id
        type: mongoose.Schema.Types.ObjectId, ref: 'CourierIntegration'
    },
    isDeleted: { // order is deleted or not
        type: mongoose.Schema.Types.Boolean, default: false
    },
    status: { // order status
        type: String, enum: ['pending', 'dispatched', 'delivered', 'cancelled'], default: "pending"
    },
    delivery_address: {
        type: String, required: true
    },
    subtotal: {
        type: Number
    }
}, { timestamps: true } // adds operational timestamps to the schema
);

// export the productEntrySchema
export { productEntrySchema };
export default mongoose.model('Order', orderSchema);
import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const productEntrySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // required to be filled
    quantity: { type: Number, required: true }, // required to be filled
}, { _id: false });

const orderSchema = new mongoose.Schema({
    _id: { // order id
        type: Number, unique: true 
    },
    productEntries: [productEntrySchema], // entries of products in the order
    store: { // store id
        type: Number, ref: 'Store', required: true 
    }, 
    platform:  { // eCommerce platform id
        type: Number, ref: 'ECommerceIntegration', required: true 
    },
    courier: { // courier id
        type: Number, ref: 'CourierIntegration' 
    },
    isDeleted: { // order is deleted or not
        type: Boolean, default: false 
    },
    status: { // order status
        type: String, required: true 
    },
}, { timestamps: true } // adds operational timestamps to the schema
);

orderSchema.plugin(AutoIncrement, { id: "order_id_counter", inc_field: "_id" }); // for auto incrementing the order id

export default mongoose.model('Order', orderSchema);
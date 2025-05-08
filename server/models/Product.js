import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const thirdPartyTagSchema = new mongoose.Schema({
    integration: { type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration', required: true },
    thirdPartyProductId: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    _id: { // product id
        type: Number, unique: true 
    }, 
    name: { // product name
        type: String, required: true 
    }, 
    price: { // product price
        type: Number, required: true 
    },
    addedBy: { // user id who added the product
        type: Number, ref: 'User', required: true 
    },
    store: { // store id
        type: Number, ref: 'Store', required: true 
    },
    tag: { // product tag
        type: String, default: "" 
    },
    description: { // product description
        type: String, default: "" 
    },
    brand: { // product brand
        type: String, default: "" 
    },
    stockAmount: { // product stock amount
        type: Number, default: 0 
    },
    thirdPartyProductTags: [thirdPartyTagSchema],
    isDeleted: { // product is deleted or not
        type: Boolean, default: false 
    },
    image: { // product image link or path
        type: String, default: "" 
    }
}, { timestamps: true } // adds operational timestamps to the schema
);

productSchema.plugin(AutoIncrement, { id: "product_id_counter", inc_field: "_id" }); // for auto incrementing the product id

// for unique constraints on the product
productSchema.index({ store: 1, name: 1 }, { unique: true });
productSchema.index({ store: 1, _id: 1 }, { unique: true }); // corrected 'pid' to '_id'
productSchema.index({ store: 1, isDeleted: 1 }); // added index for isDeleted

export default mongoose.model('Product', productSchema);

import mongoose from "mongoose";

const thirdPartyTagSchema = new mongoose.Schema({
    integration: { type: mongoose.Schema.Types.ObjectId, ref: 'ECommerceIntegration', required: true },
    thirdPartyProductId: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    name: { // product name
        type: mongoose.Schema.Types.String, required: true 
    }, 
    price: { // product price
        type: mongoose.Schema.Types.Number, required: true 
    },
    addedBy: { // user id who added the product
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true 
    },
    store: { // store id
        type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true 
    },
    tag: { // product tag
        type: mongoose.Schema.Types.String, default: "" 
    },
    description: { // product description
        type: mongoose.Schema.Types.String, default: "" 
    },
    brand: { // product brand
        type: mongoose.Schema.Types.String, default: "" 
    },
    stockAmount: { // product stock amount
        type: mongoose.Schema.Types.Number, default: 0 
    },
    thirdPartyProductTags: [thirdPartyTagSchema],
    isDeleted: { // product is deleted or not
        type: mongoose.Schema.Types.Boolean, default: false 
    },
    image: { // product image link or path
        type: mongoose.Schema.Types.String, default: "" 
    }
}, { timestamps: true } // adds operational timestamps to the schema
);

// for unique constraints on the product
productSchema.index({ store: 1, name: 1 }, { unique: true });
productSchema.index({ store: 1, _id: 1 }, { unique: true }); // corrected 'pid' to '_id'
productSchema.index({ store: 1, isDeleted: 1 }); // added index for isDeleted

export default mongoose.model('Product', productSchema);

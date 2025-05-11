import ParentEStore from "./ParentEStore.js";
import { DUMMY_STORE } from "../../utils/constants.js";
import EcommerceIntegration from "../../models/EcommerceIntegration.js";
import Product from '../../models/Product.js'
import Order from '../../models/Order.js'
import { productEntrySchema } from "../../models/Order.js";
class DummyStore extends ParentEStore {
    constructor(ecommerceIntegration) {
        super();
        // Check if the passed object is an instance of EcommerceIntegration
        // if (ecommerceIntegration.constructor !== EcommerceIntegration) {
        //     console.log("ecommerceIntegration.constructor",
        //                 ecommerceIntegration.constructor,
        //                 "pass an EcommerceIntegration object in constructor of DummyStore.");
        //     throw new Error("Invalid e-commerce integration object");
        // }
        // setting the attribute values
        this.token = ecommerceIntegration.token;
        this.associatedEmail = ecommerceIntegration.email;
        this.baseUrl = ecommerceIntegration.apiEndpoint;
        this.title = DUMMY_STORE;
    }

    // Product Management
    async createProduct(productDetails) {
        console.log(`Creating product in ${this.title} with details:`, productDetails);
        // Implement actual API call here
        return { success: true, productId: "dummy-product-123" };
    }

    async getAllProducts(user, store) {
        try {
            // Fetch products from dummy service
            const product_endpoint = this.baseUrl + '/products';
            const response = await axios.get(product_endpoint);
            // for each product store that product if not found in the database
            for (const prod of response.data) {
                // find
                // if not found then create a new product
                const product_from_database = await Product.findOne({ name: prod.name, store: store._id });
                if (!product_from_database) {
                    console.log("creating new product in database");
                    const newProduct = new Product({
                        name:prod.name,
                        price:prod.price,
                        addedBy:user._id,
                        store:store._id,
                        tag:prod.tag,
                        description:prod.description,
                        brand:prod.brand,
                        stockAmount:prod.stockAmount,
                        thirdPartyProductTags:[{
                            integration:this.ecommerceIntegration._id,
                            thirdPartyProductId:prod.id
                        }],
                        isDeleted:false,
                    })

                    await newProduct.save();
                }
            }
            return { success: true };
        } catch (err) {
            console.error('Error in getAllProducts:', err);
            return { success: false, error: err.message };
        }
    }

    async updateProduct(productId, updates) {
        console.log(`Updating product ${productId} in ${this.title} with:`, updates);
        // Implement actual API call here
        return { success: true, updated: true };
    }

    async deleteProduct(productId) {
        console.log(`Deleting product ${productId} from ${this.title}`);
        // Implement actual API call here
        return { success: true, deleted: true };
    }

    async getProduct(productId) {
        console.log(`Getting product ${productId} from ${this.title}`);
        // Implement actual API call here
        return {
            id: productId,
            name: "Dummy Product",
            price: 19.99,
            stock: 100
        };
    }

    async listProducts(filters) {
        console.log(`Listing products from ${this.title} with filters:`, filters);
        // Implement actual API call here
        return [
            { id: "dummy-1", name: "Dummy Product 1", price: 19.99, stock: 100 },
            { id: "dummy-2", name: "Dummy Product 2", price: 29.99, stock: 50 }
        ];
    }

    // Inventory Management
    async updateStock(productId, quantity) {
        console.log(`Updating stock for product ${productId} to ${quantity} in ${this.title}`);
        // Implement actual API call here
        return { success: true, newStock: quantity };
    }

    async getStock(productId) {
        console.log(`Getting stock for product ${productId} from ${this.title}`);
        // Implement actual API call here
        return { productId, stock: 100 };
    }

    // Order Management
    async getOrders(store, ecomIntegrationObj) {
        console.log(`Getting orders from ${this.title} with filters:`, filters);
        const order_endpoint = this.baseUrl + '/orders';
        const response = await axios.get(order_endpoint);
        // for each order store that order if not found in the database
        for (const order of response.data) {
            // find the order by id in the databse
            const order_in_db = await Order.findOne({ orderid: order.id });
            if (!order_in_db) {
                // create a new order in the databse
                /*const productEntrySchema = new mongoose.Schema({
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
                    */
                const product_entries = order.summary.products.map( orderprod => {
                    // search the product from the database and set id and value
                    Product.findOne({ name: orderprod.name })
                    .then(product => {
                        return {
                            product: product._id,
                            quantity: orderprod.quantity
                        }
                    })
                    .catch(err => {
                        console.log("product not found in database");
                        return null;
                    })
                });
                // create a new order in the databse
                const newOrder = new Order({
                    orderid: order.id,
                    store: store._id,
                    productEntries: product_entries,
                    platform: ecomIntegrationObj._id,
                    courier: null,
                    status: "pending",
                    delivery_address: order.summary.deliveryAddress,
                    subtotal: order.summary.totalSubtotal
                })
                newOrder.save()
                .then(order => {
                    console.log("new order created in database");
                })
                .catch(err => {
                    console.log("error in creating new order in database");
                })
            }
        }
    }

    async getOrderDetails(orderId) {
        console.log(`Getting details for order ${orderId} from ${this.title}`);
        // Implement actual API call here
        return {
            id: orderId,
            customer: "John Doe",
            total: 49.98,
            items: [
                { productId: "dummy-1", quantity: 2, price: 19.99 },
                { productId: "dummy-2", quantity: 1, price: 9.99 }
            ],
            status: "PENDING"
        };
    }

    async updateOrderStatus(orderId, status) {
        console.log(`Updating status of order ${orderId} to ${status} in ${this.title}`);
        // Implement actual API call here
        return { success: true, newStatus: status };
    }

    // Price Management
    async updatePrice(productId, price) {
        console.log(`Updating price of product ${productId} to ${price} in ${this.title}`);
        // Implement actual API call here
        return { success: true, newPrice: price };
    }

    async getPricing(productId) {
        console.log(`Getting pricing for product ${productId} from ${this.title}`);
        // Implement actual API call here
        return { productId, price: 19.99, salePrice: 15.99, currency: "USD" };
    }
}

export default DummyStore;
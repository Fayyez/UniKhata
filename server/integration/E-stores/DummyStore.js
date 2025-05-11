import ParentEStore from "./ParentEStore.js";
import { DUMMY_STORE } from "../../utils/constants.js";
import EcommerceIntegration from "../../models/EcommerceIntegration.js";
import Product from '../../models/Product.js'
import Order from '../../models/Order.js'
import { productEntrySchema } from "../../models/Order.js";
import axios from 'axios';
import { ThirdPartyTag } from "../../models/Product.js";
class DummyStore extends ParentEStore {
    constructor(ecommerceIntegration) {
        super();
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

    async getAllProducts(user, store, ecomIntegrationObj) {
        try {
            //console.log("code trying fetch all products from the dummy store");
            // Fetch products from dummy service
            const product_endpoint = this.baseUrl + '/products';
            const response = await axios.get(product_endpoint);
            // for each product store that product if not found in the database
            // console.log("these products are fetched from dummy store", response.data.slice(0, 3));
            for (const prod of response.data) {
                // find
                // if not found then create a new product
                const product_from_database = await Product.findOne({ name: prod.name, store: store._id });
                if (!product_from_database) {
                    // console.log("creating new product in database");
                    const thirdPartyTag = new ThirdPartyTag({
                        integration: ecomIntegrationObj._id,
                        thirdPartyProductId:prod.id
                    })
                    // create a new product in the database
                    const newProduct = new Product({
                        name:prod.name,
                        price:prod.price,
                        addedBy:user._id,
                        store:store._id,
                        tag:prod.tag,
                        description:prod.description,
                        brand:prod.brand,
                        stockAmount:prod.stockAmount,
                        thirdPartyProductTags:[thirdPartyTag],
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
        const order_endpoint = this.baseUrl + '/orders';
        const response = await axios.get(order_endpoint);
        // for each order store that order if not found in the database
        for (const order of response.data) {
            // find the order by id in the databse
            console.log("this is the order from dummy store", order.id);
            const order_in_db = await Order.findOne({ orderid: order.id });
            if (!order_in_db) {
                // Use Promise.all to wait for all product lookups
                const productPromises = order.summary.products.map(async (orderprod) => {
                    console.log("this is the orderprod", orderprod);
                    try {
                        const product = await Product.findOne({ name: orderprod.name, store: store._id });
                        if (product) {
                            console.log("this is the product found in database");
                            return {
                                product: product._id,
                                name: orderprod.name || product.name,
                                quantity: orderprod.quantity
                            };
                        } else {
                            console.log("product not found in database");
                            return null;
                        }
                    } catch (err) {
                        console.log("error finding product:", err.message);
                        return null;
                    }
                });
                const product_entries = await Promise.all(productPromises);
                // Filter out null entries
                const validProductEntries = product_entries.filter(entry => entry !== null);
                console.log("this is the product entries", validProductEntries);
                // Create new order only if we have valid product entries
                if (validProductEntries.length > 0) {
                    const newOrder = new Order({
                        orderid: order.id,
                        store: store._id,
                        productEntries: validProductEntries,
                        platform: ecomIntegrationObj.platform,
                        courier: null,
                        status: "pending",
                        delivery_address: order.summary.deliveryAddress,
                        subtotal: order.summary.totalSubtotal
                    });

                    try {
                        await newOrder.save();
                        console.log("new order created in database");
                    } catch (err) {
                        console.log("error in creating new order in database:", err.message);
                    }
                } else {
                    console.log("No valid product entries found for order", order.id);
                }
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
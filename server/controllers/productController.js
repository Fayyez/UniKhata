import Product from '../models/Product.js';
import ProductCounter from '../models/ProductCounter.js';

const products = [{pid: 1, uid: 1, sid: 2, name: "Product 1", price: 100, isDeleted:false}, {pid: 2, uid: 2, sid: 3, name: "Product 2", price: 200, isDeleted:false}]; // Sample data

export const getAllProducts = async (req, res) => {
    const uid = req.body?.uid; // if body exists and there is key named uid in it, then define const uid
    const sid = req.body?.sid; // if body exists and there is key named sid in it, then define const sid
    const filters = req.query; // if query exists then define const filters

    // if uid exists and filters is empty, then get all products under the user
    // if sid exists and filters is empty, then get all products under the store
    // if both uid and sid exist and filter is empty, then get all products under the user and store
    // if filters exist, then get all products under the user and store with the filters applied
    // if no uid, no sid and no filters, then get all products in the database
    console.log("Filters: ", filters);
    console.log("UID: ", uid); 
    console.log("SID: ", sid);
    console.log("Products: ", products);

    const filtersExist = Object.keys(filters).length > 0; // Check if filters exist

    if (uid && !sid && !filtersExist) {
        // const userProducts = Product.find({ uid }); 
        console.log("Fetching products for user: ", uid);
        const userProducts = products.filter(product => product.uid === uid);
        return res.status(200).json({ message: "Products fetched successfully", products: userProducts });
    } else if (sid && !uid && !filtersExist) {
        // const storeProducts = Product.find({ sid });
        console.log("Fetching products for store: ", sid);
        const storeProducts = products.filter(product => product.sid === sid);
        return res.status(200).json({ message: "Products fetched successfully", products: storeProducts });
    } else if (uid && sid && !filtersExist) {
        // const userStoreProducts = Product.find({ uid, sid });
        console.log("Fetching products for user: ", uid, " and store: ", sid);
        const userStoreProducts = products.filter(product => product.uid === uid && product.sid === sid);
        return res.status(200).json({ message: "Products fetched successfully", products: userStoreProducts });
    } else if (filtersExist) {
        console.log("Fetching products with filters: ", filters);
        const filteredProducts = products.filter(product => {
            let isValid = true;
            for (const key in filters) {
                if (product[key] !== filters[key]) {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        });
        return res.status(200).json({ message: "Products fetched successfully", products: filteredProducts });
    } else {
        console.log("Fetching all products in the database");
        return res.status(200).json({ message: "Products fetched successfully", products });
    }
};

export const getProductById = async (req, res) => {
    const productId = req.params.pid; // get the product id from the url
    const product = products.find(product => product.pid === parseInt(productId)); // find the product in the sample data array
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product fetched: ", productId);
    console.log("Product: ", product);
    return res.status(200).json({ message: "Product fetched successfully", product });

    // do error handling here
    // const productId = req.params.pid;
    // const product = await Product
    //     .findById(productId)
    //     .populate('store')
    //     .populate('user');
    // if (!product) {
    //     return res.status(404).json({ message: "Product not found" });
    // }
    // res.status(200).json({ message: "Product fetched successfully", product });
    // console.log("Product fetched: ", productId);
    // console.log("Product: ", product);
    // return res.status(200).json({ message: "Product fetched successfully", product });
};

export const createProduct = async (req, res) => {
    const newProduct = req.body;
    if (!newProduct) {
        return res.status(400).json({ message: "Product data is required" });
    } else if (!newProduct.name || !newProduct.price) {
        return res.status(400).json({ message: "Product name and price are required" });
    } else if (isNaN(newProduct.price)) {
        return res.status(400).json({ message: "Product price must be a number" });
    } else if (newProduct.price < 0) {
        return res.status(400).json({ message: "Product price must be a positive number" });
    } 
    products.push(newProduct); // Add the new product to the sample data array
    console.log("Product created: ", newProduct.pid);
    console.log("Products: ", products);
    return res.status(201).json({ message: "Product created successfully", productId: newProduct.pid });
    // do error handling here
    // const productCounter = await ProductCounter.findOne({ store: product.store });
    // if (!productCounter) {
    //     return res.status(404).json({ message: "Store not found" });
    // }
    // const newProductId = productCounter.lastProductId + 1;
    // product.id = newProductId;
    // productCounter.lastProductId = newProductId;
    // await productCounter.save();
    // const newProduct = await Product.create(product);
    // res.status(201).json({ message: "Product created successfully", productId: newProduct.id });
};

export const updateProduct = async (req, res) => {
    // this will be used in a patch request
    const productId = req.params.pid; // get the product id from the url
    const updatedProduct = req.body; // get the updated product data from the body
    if (!updatedProduct) {
        return res.status(400).json({ message: "Product data is required" });
    } else if (!updatedProduct.name || !updatedProduct.price) {
        return res.status(400).json({ message: "Product name and price are required" });
    } else if (isNaN(updatedProduct.price)) {
        return res.status(400).json({ message: "Product price must be a number" });
    } else if (updatedProduct.price < 0) {
        return res.status(400).json({ message: "Product price must be a positive number" });
    }

    const productIndex = products.findIndex(product => product.pid === parseInt(productId)); // find the index of the product in the sample data array
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }
    products[productIndex] = { ...products[productIndex], ...updatedProduct }; // update the product in the sample data array
    console.log("Product updated: ", productId);
    console.log("Products: ", products);
    return res.status(200).json({ message: "Product updated successfully", productId });

    // do error handling here
    // const productId = req.params.pid;
    // const updatedProduct = req.body;
    // if (!updatedProduct) {
    //     return res.status(400).json({ message: "Product data is required" });
    // } else if (!updatedProduct.name || !updatedProduct.price) {
    //     return res.status(400).json({ message: "Product name and price are required" });
    // } else if (isNaN(updatedProduct.price)) {
    //     return res.status(400).json({ message: "Product price must be a number" });
    // } else if (updatedProduct.price < 0) {
    //     return res.status(400).json({ message: "Product price must be a positive number" });
    // }
    // const product = await Product
    //     .findByIdAndUpdate(productId, updatedProduct, { new: true })
    //     .populate('store')
    //     .populate('user');
    // if (!product) {
    //     return res.status(404).json({ message: "Product not found" });
    // }
    // res.status(200).json({ message: "Product updated successfully", product });
};


export const deleteProduct = async (req, res) => {
    // this will be used in a delete request
    const productId = req.params.pid; // get the product id from the url
    const productIndex = products.findIndex(product => product.pid === parseInt(productId)); // find the index of the product in the sample data array
    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }
    products[productIndex].isDeleted = true; // soft delete the product in the sample data array
    console.log("Product deleted: ", productId);
    console.log("Products: ", products);
    return res.status(200).json({ message: "Product deleted successfully", productId });

    // do error handling here
    // const productId = req.params.pid;
    // const product = await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true });
    // if (!product) {
    //     return res.status(404).json({ message: "Product not found" });
    // }
    // res.status(200).json({ message: "Product deleted successfully", product });
};
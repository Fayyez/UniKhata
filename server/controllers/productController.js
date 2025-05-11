import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
    const uid = req.query?.uid;
    const sid = req.query?.sid; 
    // const filters = req.query;

    // const filtersExist = Object.keys(filters).length > 0; // check if filters exist
    const filtersExist = false;

    try {
        if (uid && !sid && !filtersExist) { // if there's only uid
            const userProducts = await Product.find({ addedBy : uid, isDeleted: false });
            if (userProducts.length === 0) {
                return res.status(404).json({ message: "No products found for this user" });
            }
            return res.status(200).json({ message: "Products fetched successfully", products: userProducts });
        } else if (sid && !uid && !filtersExist) {
            const storeProducts = await Product.find({ store: sid, isDeleted: false });
            if (storeProducts.length === 0) {
                return res.status(404).json({ message: "No products found for this store" });
            }
            return res.status(200).json({ message: "Products fetched successfully", products: storeProducts });
        } else if (uid && sid && !filtersExist) {
            const userStoreProducts = await Product.find({ addedBy : uid, store:sid, isDeleted: false });
            if (userStoreProducts.length === 0) {
                return res.status(404).json({ message: "No products found for this user and store" });
            }
            return res.status(200).json({ message: "Products fetched successfully", products: userStoreProducts });
        } else if (filtersExist) {
            return res.status(501).json({ message: "Filters are not supported yet" });
        } else {
            try{
                // TODO: create product in all the integrated stores as well
            } catch(error) {
                    //throw the error
            }
            console.log("Fetching all products in the database");
            const allProducts = await Product.find({ isDeleted: false }); // fetch all products in the database
            return res.status(200).json({ message: "Products fetched successfully", products: allProducts });
        }
    } catch (error) {
        console.error("Error fetching products: ", error); // log the error to the console
        return res.status(500).json({ message: "Error fetching products", error }); // return an error message and the error object
    }
};

export const getProductById = async (req, res) => {
    const productId = req.params.pid; // get the product id from the url

    try {
        const product = await Product.findById(productId); // find the product in the database
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log("Product fetched: ", productId);
        console.log("Product: ", product);
        return res.status(200).json({ message: "Product fetched successfully", product });
    } catch (error) {
        console.error("Error fetching product: ", error); // log the error to the console
        return res.status(500).json({ message: "Error fetching product", error }); // return an error message and the error object
    }
};

export const createProduct = async (req, res) => {
    console.log("req.body", req.body);
    const newProduct = req.body;
    console.log("newProduct", newProduct);
    const product = new Product(newProduct); // create a new product object with the provided data
    console.log("newProduct", newProduct);
    
    if (!newProduct.name || newProduct.price == null || newProduct.price < 0) {
        return res.status(400).json({ message: "Invalid product data" });
    }
    
    try {
        try{
        // TODO: create product in all the integrated stores as well
        } catch(error) { 
            //throw the error
        }
        const savedProduct = await product.save(); // save the product to the database
        console.log("Product created: ", savedProduct._id); // log the product id to the console
        return res.status(201).json({ message: "Product created successfully", product: savedProduct }); // return a success message and the product object
    } catch (error) {
        console.error("Error creating product: ", error); // log the error to the console
        return res.status(500).json({ message: "Error creating product", error }); // return an error message and the error object
    }
};

export const updateProduct = async (req, res) => {
    const productId = req.params.pid; // get the product id from the url
    try {
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true }); // ensure productId is used as is and validators are run
        console.log("product", product);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product updated successfully", product }); // return a success message and the updated product
    } catch (error) {
        console.error("Error updating product: ", error); // log the error to the console
        return res.status(500).json({ message: "Error updating product", error }); // return an error message and the error object
    }
};


export const deleteProduct = async (req, res) => {
    const productId = req.params.pid; // get the product id from the url
    console.log("productId", productId);
    try {
        const product = await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true }); // soft delete the product in the database
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully", productId }); // return a success message and the product id
    } catch (error) {
        console.error("Error deleting product: ", error); // log the error to the console
        return res.status(500).json({ message: "Error deleting product", error }); // return an error message and the error object
    }
};

export const checkProductStocks = async (req, res) => {
    try {
        const storeId = req.params.sid;
        const products = await Product.find({ store: storeId, isDeleted: false });
        const productsWithLowStocks = products.filter(product => product.stockAmount <= 5);
        return res.status(200).json({ message: "Products with low stocks fetched successfully", products: productsWithLowStocks });
    } catch (error) {
        console.error("Error checking product stocks: ", error); 
        return res.status(500).json({ message: "Error checking product stocks", error }); 
    }
}
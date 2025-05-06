import express from "express";
// import { Product } from "../models/Product.js";

//TODO: define the product model related services here
// all business logic should be in ../controllers/productController.js

const router = express.Router();

// Route Format:
// REQ_TYPE ROUTE {PAYLOAD} : DESCRIPTION (SUCCESS STATUS CODE). [POTENTIAL QUERY PARAMETERS (are optional and will be fetched form url)]

// -------------------------------------------------------------------------------------------------

// PRODUCTS:
// GET products/ {uid} : Returns all the products under a user (200). [?name, ?lowPrice, ?highPrice]
// GET products/ {storeid} : Returns all the products under a specific store (200). [?name, ?lowPrice, ?highPrice]
// GET products/ {} : Returns all the products existing in the database (200). [?name, ?lowPrice, ?highPrice]
// GET products/:pid {} : Returns the product with id = pid (200).
// POST products/ {product} : Returns the created product id (201) created via provided product details.
// PUT products/:pid {product} : Updates the product with id = pid (200).
// DELETE products/:pid {} : Soft deletes a product with id = pid (200).

router.get('/', async (req, res) => {
    // req.query => for query parameters
    // req.params => for url parameters
    // req.body => for body parameters
    // const products = getProducts(query, params, body);
    // send back products as json

    res.status(200).json({ message: "Products fetched successfully"});
});

router.post('/', async (req, res) => {
    // create a new product
    
    const product = req.body; // assuming the product details are sent in the request body
    const newProduct = await Product.create(product); // assuming you have a Product model to handle database operations
    res.status(201).json({ message: "Product created successfully", productId: newProduct.id }); // send back the created product id
});


export default router;
import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductById } from "../controllers/productController.js";

const router = express.Router();

// Route Format:
// REQ_TYPE ROUTE {PAYLOAD} : DESCRIPTION (SUCCESS STATUS CODE). [POTENTIAL QUERY PARAMETERS (are optional and will be fetched form url)]

// -------------------------------------------------------------------------------------------------

// PRODUCTS:
// ✅ GET products/ {uid} : Returns all the products under a user (200). [?name, ?lowPrice, ?highPrice]
// ✅ GET products/ {storeid} : Returns all the products under a specific store (200). [?name, ?lowPrice, ?highPrice]
// ✅ GET products/ {} : Returns all the products existing in the database (200). [?name, ?lowPrice, ?highPrice]
// ✅ GET products/:pid {} : Returns the product with id = pid (200).
// ✅ POST products/ {product} : Returns the created product id (201) created via provided product details.
// ✅ PATCH products/:pid {product} : Updates the product with id = pid (200).
// ✅ DELETE products/:pid {} : Soft deletes a product with id = pid (200).

router.get('/', getAllProducts); // get all products under a user or store or all products in the database
router.get('/:pid', getProductById); // get a product with id = pid
router.post('/', createProduct); // create a new product
router.patch('/:pid', updateProduct); // update a product with id = pid
router.delete('/:pid', deleteProduct); // soft delete a product with id = pid

export default router;
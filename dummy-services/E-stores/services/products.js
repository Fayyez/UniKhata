const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/products.json");
let products = require(productsFilePath);

// GET /products => get all products
router.get("/", (req, res) => {
  res.json(products);
});

// GET /products/:id => get product by ID
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  product ? res.json(product) : res.status(404).json({ error: "Product not found" });
});

// PATCH /products/:id/restock => add stock to a product
router.patch("/:id/restock", (req, res) => {
  const productId = parseInt(req.params.id);
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "Quantity must be a positive integer" });
  }

  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  products[productIndex].stock += quantity;

  // Save updated products to file
  fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).json({ error: "Failed to update product stock" });
    }
    res.json({ message: "Stock updated successfully", product: products[productIndex] });
  });
});

module.exports = router;

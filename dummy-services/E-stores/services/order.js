// all services of orders related to estores go here

const express = require("express");
const router = express.Router();
const orders = require("../data/orders");
const { generateRandomOrder, saveOrderInOrderJson } = require("../data/order-utils");
// GET /orders
router.get("/", (req, res) => {
  res.json(orders);
});

// GET /orders/:id
router.get("/:id", (req, res) => {
  // if id===all then return all orders
  // if id==="new" then generate a new order and return it
  // else convert to int and return only the order requested or else return error with appropriate status code
  if (req.params.id === "all") {
    res.json(orders);
  } else if (req.params.id === "new") {
    const order = generateRandomOrder();
    saveOrderInOrderJson(order);
    res.json(order);
  } else {
    try {
      const order = orders.find((o) => o.id === parseInt(req.params.id));
      order ? res.json(order) : res.status(404).json({ error: "**Order not found" });
    } catch (error) {
      res.status(400).json({ error: "**Bad Request Error: Invalid order ID" });
    }
  }
});

// POST /orders
router.post("/", (req, res) => {
  const order = generateRandomOrder();
  saveOrderInOrderJson(order);
  res.json(order);
});

// PUT /orders/:id
router.put("/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: "**Order not found" });
  order.status = req.body.status;
  res.json(order);
});

// DELETE /orders/:id
router.delete("/:id", (req, res) => {
  const order = orders.find((o) => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  orders.splice(orders.indexOf(order), 1);
  res.json({ message: "Order deleted" });
});


module.exports = router;

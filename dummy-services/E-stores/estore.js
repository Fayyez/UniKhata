const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

// Import modular routes
const orderRoutes = require("./services/order");
const productRoutes = require("./services/products");
//const paymentRoutes = require("./routes/payments");

// Use routes
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`>> Dummy Estore Server Running at http://localhost:${PORT}`);
});

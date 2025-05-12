const express = require('express');
const router = express.Router();

// create a dispatch service
router.post('/', (req, res) => {
    // fetch a dispatch object from body and save it in the "../data/orders.json" file
    const dispatch = req.body;
    const orders = readJsonFile(ORDERS_FILE);
    orders.push(dispatch);
    writeJsonFile(ORDERS_FILE, orders);
    res.json({ message: "Dispatch created successfully" });
});


module.exports = router;

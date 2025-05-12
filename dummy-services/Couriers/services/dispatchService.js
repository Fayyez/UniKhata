const express = require('express');
const router = express.Router();

const ORDERS_FILE = './data/orders.json';
function readJsonFile(file) {
    const fs = require('fs');
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
}

function writeJsonFile(file, data) {
    const fs = require('fs');
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// create a dispatch service
router.post('/', (req, res) => {
    // fetch a dispatch object from body and save it in the "../data/orders.json" file
    const dispatch = req.body;
    console.log("dispatch", dispatch);
    let datatowrite = {
        ...dispatch,
        status: "dispatched"
    }
    console.log("datatowrite status is ", datatowrite.status);
    const orders = readJsonFile(ORDERS_FILE);
    orders.push(datatowrite);
    writeJsonFile(ORDERS_FILE, orders);
    res.status(201).json({ message: "Dispatched successfully" });
});


module.exports = router;

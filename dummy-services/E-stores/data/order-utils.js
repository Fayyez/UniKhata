function generateRandomOrder() {
    return 0;
}

function saveOrderInOrderJson(order) {
    const orders = require("./orders.json");
    orders.push(order);
    fs.writeFileSync("./data/orders.json", JSON.stringify(orders, null, 2));
}

module.exports = { generateRandomOrder, saveOrderInOrderJson };

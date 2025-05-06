import express from 'express';
import fetchEStores from '../utils/estoreFactory.js'
import Store from '../models/Store';

const router = express.Router();

// TODO: define all the order object related services here
// all business logic should be in ../controllers/orderController.js
// 

// ORDERS:
// GET orders/ {uid} : Returns all the orders under a user (200).
// GET orders/ {storeid} : Returns all the orders under a specific store (200).
// GET orders/ {} : Returns all the orders existing in the database (200).
// GET orders/:oid {} : Returns the order with id = oid (200).
// PATCH orders/:oid {order_fields} : Updates the order with id = oid (200).
// DELETE orders/:oid {} : Soft deletes an order with id = oid (200).

router.get('/new', (req, res) => {
        // sid in req.body
        // fetch that store from the database
        // if not found, return 404
        const integratedPlatforms = fetchEStores(store.eCommerceIntegrations);
        // for each platform, get the orders -> Orders Objects -> Save Them In DB
    }
);

router.get('/', async (req, res) => {
    // req.query => for query parameters
    // req.params => for url parameters
    // req.body => for body parameters
    // const orders = getOrders(query, params, body);
    // send back orders as json

    res.status(200).json({ message: "Orders fetched successfully"});
});

export default router;
import express from 'express';
import fetchEStores from '../utils/estoreFactory.js'
import Store from '../models/Store';
import Order from '../models/Order';

const router = express.Router();

// Route Format:
// REQ_TYPE ROUTE {PAYLOAD} : DESCRIPTION (SUCCESS STATUS CODE). [POTENTIAL QUERY PARAMETERS (are optional and will be fetched form url)]

// -------------------------------------------------------------------------------------------------

// ORDERS:
// ✅ GET orders/ {uid} : Returns all the orders under a user (200).
// ✅ GET orders/ {storeid} : Returns all the orders under a specific store (200).
// ✅ GET orders/ {} : Returns all the orders existing in the database (200).
// ✅ GET orders/:oid {} : Returns the order with id = oid (200).
// ✅ PATCH orders/:oid {order_fields} : Updates the order with id = oid (200).
// ✅ DELETE orders/:oid {} : Soft deletes an order with id = oid (200).

router.get('/', getOrders);
router.get('/:oid', getOrderById);
router.get('/new', getNewOrders);
router.patch('/:oid', updateOrder);
router.delete('/:oid', deleteOrder);
router.post('/', changeOrderStatus);

export default router;
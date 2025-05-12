import express from 'express';
import { getOrders, getOrderById, getNewOrders, updateOrder, deleteOrder, changeOrderStatus, getOrderAnalytics } from '../controllers/orderController.js';
import passport from 'passport';
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

router.get('/analytics/:sid', passport.authenticate('jwt', { session: false }), getOrderAnalytics);
router.get('/', passport.authenticate('jwt', { session: false }), getOrders);
router.get('/new', passport.authenticate('jwt', { session: false }), getNewOrders);
router.get('/:oid', passport.authenticate('jwt', { session: false }), getOrderById);
router.patch('/status/:oid', passport.authenticate('jwt', { session: false }), changeOrderStatus);
router.delete('/:oid', passport.authenticate('jwt', { session: false }), deleteOrder);
router.post('/', passport.authenticate('jwt', { session: false }), changeOrderStatus);

export default router;
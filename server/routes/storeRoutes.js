import express from 'express';
import passport from 'passport';
import passport from 'passport';
import { getAllStores, createStore, updateStore, deleteStore, getStoreById } from '../controllers/storeController.js';

const router = express.Router();

// Route Format:
// REQ_TYPE ROUTE {PAYLOAD} : DESCRIPTION (SUCCESS STATUS CODE). [POTENTIAL QUERY PARAMETERS (are optional and will be fetched form url)]

// -------------------------------------------------------------------------------------------------

// STORES:
// ✅ GET stores/ {uid} : Returns all the stores under a user (200).
// ✅ GET stores/ {} : Returns all the stores existing in the database (200).
// ✅ GET stores/:sid {} : Returns the store with id = sid (200).
// ✅ POST stores/ {store} : Returns the created store id created via provided store details (201).
// ✅ PATCH stores/:sid {store} : Updates the store with id = sid (200).
// ✅ DELETE stores/:sid {} : Soft deletes a store with id = sid (200).

router.get('/', passport.authenticate('jwt', { session: false }), getAllStores); // get all stores under a user or all stores in the database
router.get('/:sid', passport.authenticate('jwt', { session: false }), getStoreById); // get a store with id = sid
router.post('/', passport.authenticate('jwt', { session: false }), createStore); // create a new store
router.patch('/:sid', passport.authenticate('jwt', { session: false }), updateStore); // update a store with id = sid
router.delete('/:sid', passport.authenticate('jwt', { session: false }), deleteStore); // soft delete a store with id = sid

export default router;
import express from 'express';
import passport from 'passport';
import Store from '../models/Store.js';
import { v4 as uuidv4 } from 'uuid';

//TODO: fix and test tall the following services
const router = express.Router();

// Create a new store
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { name } = req.body;
        const store = new Store({
            id: uuidv4(),
            owner: req.user._id,
            name,
        });
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: 'Error creating store', error: error.message });
    }
});

// Get all stores for the logged-in user with optional filters
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { name, sortBy, sortOrder } = req.query;
        let query = { owner: req.user._id, deleted: false };

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        let stores = Store.find(query);

        // Apply sorting if specified
        if (sortBy) {
            const sortDirection = sortOrder === 'desc' ? -1 : 1;
            stores = stores.sort({ [sortBy]: sortDirection });
        }

        const result = await stores;
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stores', error: error.message });
    }
});

// Get a single store by ID
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const store = await Store.findOne({ id: req.params.id, owner: req.user._id, deleted: false });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching store', error: error.message });
    }
});

// Update a store
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { name } = req.body;
        const store = await Store.findOneAndUpdate(
            { id: req.params.id, owner: req.user._id, deleted: false },
            { name },
            { new: true }
        );
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json(store);
    } catch (error) {
        res.status(500).json({ message: 'Error updating store', error: error.message });
    }
});

// Soft delete a store
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const store = await Store.findOneAndUpdate(
            { id: req.params.id, owner: req.user._id, deleted: false },
            { deleted: true },
            { new: true }
        );
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting store', error: error.message });
    }
});

export default router;
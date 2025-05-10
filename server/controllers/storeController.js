import Store from '../models/Store.js';
import User from '../models/User.js';

// GET /stores/ {uid?} : Returns all stores under a user or all stores in the database
export const getAllStores = async (req, res) => {
    try {
        const uid = req.body?.uid; 
        let stores;
        if (uid) {
            if (isNaN(uid)) {
                return res.status(400).json({ message: 'Invalid uid' });
            }
            stores = await Store.find({ owner: uid, isDeleted: false });
        } else {
            stores = await Store.find({ isDeleted: false });
        }
        return res.status(200).json({ message: 'Stores fetched successfully', stores });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching stores', error: error.message });
    }
};

// GET /stores/:sid : Returns the store with id = sid
export const getStoreById = async (req, res) => {
    try {
        const sid = Number(req.params.sid);
        if (!sid || isNaN(sid)) {
            return res.status(400).json({ message: 'Invalid store id' });
        }
        const store = await Store.findOne({ _id: sid, isDeleted: false });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        return res.status(200).json({ message: 'Store fetched successfully', store });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching store', error: error.message });
    }
};

// POST /stores/ : Create a new store
export const createStore = async (req, res) => {
    try {
        console.log('Creating store:', req.body);
        const { name, owner, eCommerceIntegrations, courierIntegrations } = req.body;
        console.log('Name:', name);
        if (!name) {
            return res.status(400).json({ message: 'Store name is required' });
        }
        console.log('Name:', name);
        if (!owner || isNaN(owner)) {
            return res.status(400).json({ message: 'Valid owner id is required' });
        }
        console.log('Owner:', owner);
        // Optionally check if owner exists
        console.log('Owner:', owner);
        const user = await User.findOne({ _id: owner, isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: 'Owner user not found' });
        }
        console.log('User found:', user);
        const newStore = new Store({
            name,
            owner,
            eCommerceIntegrations: eCommerceIntegrations || [],
            courierIntegrations: courierIntegrations || [],
        });
        const savedStore = await newStore.save();
        // Add store to user's stores array
        user.stores.push(savedStore._id);
        await user.save();
        return res.status(201).json({ message: 'Store created successfully', store: savedStore });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating store', error: error.message });
    }
};

// PATCH /stores/:sid : Update a store
export const updateStore = async (req, res) => {
    try {
        const sid = Number(req.params.sid);
        if (!sid || isNaN(sid)) {
            return res.status(400).json({ message: 'Invalid store id' });
        }
        const updateData = req.body;
        // Prevent updating _id
        if (updateData._id) delete updateData._id;
        const updatedStore = await Store.findOneAndUpdate(
            { _id: sid, isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        return res.status(200).json({ message: 'Store updated successfully', store: updatedStore });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating store', error: error.message });
    }
};

// DELETE /stores/:sid : Soft delete a store
export const deleteStore = async (req, res) => {
    try {
        const sid = Number(req.params.sid);
        if (!sid || isNaN(sid)) {
            return res.status(400).json({ message: 'Invalid store id' });
        }
        const store = await Store.findOneAndUpdate(
            { _id: sid, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        // Remove store from user's stores array
        await User.updateOne(
            { _id: store.owner },
            { $pull: { stores: store._id } }
        );
        return res.status(200).json({ message: 'Store deleted successfully', storeId: sid });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting store', error: error.message });
    }
};

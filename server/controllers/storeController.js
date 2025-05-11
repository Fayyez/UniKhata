import Store from '../models/Store.js';
import User from '../models/User.js';
import EcommerceIntegration from '../models/EcommerceIntegration.js';
import CourierIntegration from '../models/CourierIntegration.js';

// GET /stores/ {uid?} : Returns all stores under a user or all stores in the database
export const getAllStores = async (req, res) => {
    try {
        const uid = req.query?.uid; 
        let stores;
        if (uid) {
            // if (isNaN(uid)) {
            //     return res.status(400).json({ message: 'Invalid uid' });
            // }
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
        if (!sid) {
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
        const { name } = req.body;
        console.log('Name:', name);
        if (!name) {
            return res.status(400).json({ message: 'Store name is required' });
        }
        // Optionally check if owner exists
        const user = await User.findOne({ _id: req.user?._id, isDeleted: false });
        if (!user) {
            return res.status(404).json({ message: 'Owner user not found' });
        }
        console.log('User found:', user);
        const newStore = new Store({
            name,
            owner: req.user?._id,
            eCommerceIntegrations: [],
            courierIntegrations: []
        });

        const ecom = new EcommerceIntegration({
            store: newStore._id,
            platform: "DUMMY_STORE",
            email: "fayyez2056@gmail.com",
            apiEndpoint: "http://localhost:4001",
            token: "test_token"
        })

        const courier =new CourierIntegration({
            store: newStore._id,
            title: "my dummy courier",
            courierName: "DUMMY_COURIER",
            emailOrCredential: "fayyez2056@gmail.com",
            apiEndpoint: "http://localhost:4002",
            token: "test_token"
        })
        // set newStores 
        newStore.eCommerceIntegrations.push(ecom._id);
        newStore.courierIntegrations.push(courier._id);
        console.log('New store created:', newStore._id);
        newStore.save()
        .then(savedStore => {
            console.log("saved with success");
            user.stores.push(savedStore._id);
            console.log("added store to user");
            user.save();
            console.log("new store saved under user");
            ecom.save()
            .then(savedEcom => {
                console.log("ecom saved with success");
            })
            .catch(error => {
                console.log("error");
                throw error;
            })

            courier.save()
            .then(savedCourier => {
                console.log("courier saved with success");
            })
            .catch(error => {
                console.log("error");
                throw error;
            })

        }).catch(error => {
            console.log("error");
            throw error;
        })
        return res.status(201).json({ message: 'Store created successfully', store: newStore });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating store', error: error.message });
    }
};

// PATCH /stores/:sid : Update a store
export const updateStore = async (req, res) => {
    try {
        const sid = Number(req.params.sid);
        if (!sid) {
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
        if (!sid) {
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

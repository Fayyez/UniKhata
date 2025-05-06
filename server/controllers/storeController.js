import Store from '../models/Store.js';

export const createStore = async (req, res) => {
    try {
        // this will be used inside a post request
        const store = new Store(req.body); // create a new store object with the data from the request body
        await store.save(); // save the store to the database
        console.log("Store created: ", store._id); // log the store id to the console
        return res.status(201).json({ message: "Store created successfully", store }); // return a success message and the store object
    } catch (error) {
        console.error("Error creating store: ", error); // log the error to the console
        return res.status(500).json({ message: "Error creating store", error }); // return an error message and the error object
    } 
};

export const getStores = async (req, res) => {
    const uid = req.body?.uid; // if body exists and there is key named uid in it, then define const uid
    
    if (!uid) {
        // if uid is not provided, return all stores in the database
        const stores = await Store.find({});
        return res.status(200).json({ message: "Stores fetched successfully", stores });
    }
    // if uid is provided, return all stores under the user
    const stores = await Store.find({ owner: uid }); // updated query to match 'owner' field with 'uid'
    if (stores.length === 0) {
        return res.status(404).json({ message: "No stores found for this user" });
    }
    return res.status(200).json({ message: "Stores fetched successfully", stores });
};

export const getStoreById = async (req, res) => {
    // get the store id from the url
    const storeId = req.params.sid; // get the store id from the url
    // find the store in the database
    const store = await Store.findById(storeId); // find the store in the database
    if (!store) {
        return res.status(404).json({ message: "Store not found" });
    }
    console.log("Store fetched: ", storeId);
    console.log("Store: ", store);
    return res.status(200).json({ message: "Store fetched successfully", store });
};

export const updateStore = async (req, res) => {
    // this will be used inside a patch request
    const storeId = req.params.sid; // get the store id from the url
    const store = await Store.findById(storeId); // find the store in the database
    if (!store) {
        return res.status(404).json({ message: "Store not found" });
    }
    // update the store with the new data
    const updatedStore = await Store.findByIdAndUpdate(storeId, req.body, { new: true });
    return res.status(200).json({ message: "Store updated successfully", updatedStore });
};

export const deleteStore = async (req, res) => {
    // this will be used inside a delete request
    // set the isDeleted field to true
    const storeId = req.params.sid; // get the store id from the url
    const store = await Store.findById(storeId); // find the store in the database
    if (!store) {
        return res.status(404).json({ message: "Store not found" });
    }
    // update the store with the new data
    const updatedStore = await Store.findByIdAndUpdate(storeId, { isDeleted: true }, { new: true });
    return res.status(200).json({ message: "Store deleted successfully", updatedStore });
};
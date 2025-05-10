// TODO: Implement integration controller methods to handle third-party service integrations

/**
 * Controller for managing integrations with third-party services
 * This file will contain methods for handling various integration functionalities
 */

import EcommerceIntegration from '../models/EcommerceIntegration.js';
import CourierIntegration from '../models/CourierIntegration.js';
import Store from '../models/Store.js';

// --- Ecommerce Integration Controllers ---

// Get all ecommerce integrations with optional filters
export const getAllEcommerceIntegrations = async (req, res) => {
    try {
        const { store, platform, title } = req.query;
        const filter = { };
        
        // Apply filters if provided
        if (store && !isNaN(store)) filter.store = parseInt(store);
        if (platform) filter.platform = platform;
        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        
        const integrations = await EcommerceIntegration.find(filter);
        return res.status(200).json({ 
            message: 'Ecommerce integrations fetched successfully', 
            integrations 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error fetching ecommerce integrations', 
            error: error.message 
        });
    }
};

// Get ecommerce integration by ID
export const getEcommerceIntegrationById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid integration ID' });
        }
        
        const integration = await EcommerceIntegration.findById(id);
        if (!integration) {
            return res.status(404).json({ message: 'Ecommerce integration not found' });
        }
        
        return res.status(200).json({ 
            message: 'Ecommerce integration fetched successfully', 
            integration 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error fetching ecommerce integration', 
            error: error.message 
        });
    }
};

// Create new ecommerce integration
export const createEcommerceIntegration = async (req, res) => {
    try {
        const { store, title, platform, email, apiEndpoint, token } = req.body;
        
        // Validate required fields
        if (!store || isNaN(store)) {
            return res.status(400).json({ message: 'Valid store ID is required' });
        }
        
        if (!title) {
            return res.status(400).json({ message: 'Integration title is required' });
        }
        
        // Check if store exists
        const storeDoc = await Store.findOne({ _id: store });
        if (!storeDoc) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        const newIntegration = new EcommerceIntegration({
            store,
            title,
            platform,
            email,
            apiEndpoint,
            token
        });
        
        const savedIntegration = await newIntegration.save();
        
        // Add integration to store's eCommerceIntegrations array
        storeDoc.eCommerceIntegrations.push(savedIntegration._id);
        await storeDoc.save();
        
        return res.status(201).json({ 
            message: 'Ecommerce integration created successfully', 
            integration: savedIntegration 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error creating ecommerce integration', 
            error: error.message 
        });
    }
};

// Update ecommerce integration
export const updateEcommerceIntegration = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid integration ID' });
        }
        
        const updateData = { ...req.body };
        // Prevent updating _id
        if (updateData._id) delete updateData._id;
        
        const updatedIntegration = await EcommerceIntegration.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedIntegration) {
            return res.status(404).json({ message: 'Ecommerce integration not found' });
        }
        
        return res.status(200).json({ 
            message: 'Ecommerce integration updated successfully', 
            integration: updatedIntegration 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error updating ecommerce integration', 
            error: error.message 
        });
    }
};

// Delete ecommerce integration
export const deleteEcommerceIntegration = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid integration ID' });
        }
        
        const integration = await EcommerceIntegration.findById(id);
        if (!integration) {
            return res.status(404).json({ message: 'Ecommerce integration not found' });
        }
        
        // Remove integration from store's eCommerceIntegrations array
        await Store.updateOne(
            { _id: integration.store },
            { $pull: { eCommerceIntegrations: integration._id } }
        );
        
        // Delete the integration
        await EcommerceIntegration.findByIdAndDelete(id);
        
        return res.status(200).json({ 
            message: 'Ecommerce integration deleted successfully', 
            integrationId: id 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error deleting ecommerce integration', 
            error: error.message 
        });
    }
};

// --- Courier Integration Controllers ---

// Get all courier integrations with optional filters
export const getAllCourierIntegrations = async (req, res) => {
    try {
        const { store, courierName, title } = req.query;
        const filter = { };
        
        // Apply filters if provided
        if (store && !isNaN(store)) filter.store = parseInt(store);
        if (courierName) filter.courierName = courierName;
        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        
        const integrations = await CourierIntegration.find(filter);
        return res.status(200).json({ 
            message: 'Courier integrations fetched successfully', 
            integrations 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error fetching courier integrations', 
            error: error.message 
        });
    }
};

// Get courier integration by ID
export const getCourierIntegrationById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid integration ID' });
        }
        
        const integration = await CourierIntegration.findById(id);
        if (!integration) {
            return res.status(404).json({ message: 'Courier integration not found' });
        }
        
        return res.status(200).json({ 
            message: 'Courier integration fetched successfully', 
            integration 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error fetching courier integration', 
            error: error.message 
        });
    }
};

// Create new courier integration
export const createCourierIntegration = async (req, res) => {
    try {
        const { store, title, courierName, emailOrCredential, apiEndpoint, token } = req.body;
        
        // Validate required fields
        if (!store || isNaN(store)) {
            return res.status(400).json({ message: 'Valid store ID is required' });
        }
        
        if (!title) {
            return res.status(400).json({ message: 'Integration title is required' });
        }
        
        // Check if store exists
        const storeDoc = await Store.findOne({ _id: store });
        if (!storeDoc) {
            return res.status(404).json({ message: 'Store not found' });
        }
        
        const newIntegration = new CourierIntegration({
            store,
            title,
            courierName,
            emailOrCredential,
            apiEndpoint,
            token
        });
        
        const savedIntegration = await newIntegration.save();
        
        // Add integration to store's courierIntegrations array
        storeDoc.courierIntegrations.push(savedIntegration._id);
        await storeDoc.save();
        
        return res.status(201).json({ 
            message: 'Courier integration created successfully', 
            integration: savedIntegration 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error creating courier integration', 
            error: error.message 
        });
    }
};

// Update courier integration
export const updateCourierIntegration = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid integration ID' });
        }
        
        const updateData = { ...req.body };
        // Prevent updating _id
        if (updateData._id) delete updateData._id;
        
        const updatedIntegration = await CourierIntegration.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedIntegration) {
            return res.status(404).json({ message: 'Courier integration not found' });
        }
        
        return res.status(200).json({ 
            message: 'Courier integration updated successfully', 
            integration: updatedIntegration 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error updating courier integration', 
            error: error.message 
        });
    }
};

// Delete courier integration
export const deleteCourierIntegration = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid integration ID' });
        }
        
        const integration = await CourierIntegration.findById(id);
        if (!integration) {
            return res.status(404).json({ message: 'Courier integration not found' });
        }
        
        // Remove integration from store's courierIntegrations array
        await Store.updateOne(
            { _id: integration.store },
            { $pull: { courierIntegrations: integration._id } }
        );
        
        // Delete the integration
        await CourierIntegration.findByIdAndDelete(id);
        
        return res.status(200).json({ 
            message: 'Courier integration deleted successfully', 
            integrationId: id 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error deleting courier integration', 
            error: error.message 
        });
    }
};
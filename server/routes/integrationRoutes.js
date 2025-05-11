//TODO:
/*
implement all services that are related to integrating a store with any third party 
services that we offer integrations with here in this file
use controller functions from ../controllers/integrationController.js
*/

import passport from 'passport';
import express from 'express';
import {
    // Ecommerce Integration controllers
    getAllEcommerceIntegrations,
    getEcommerceIntegrationById,
    createEcommerceIntegration,
    updateEcommerceIntegration,
    deleteEcommerceIntegration,

    // Courier Integration controllers
    getAllCourierIntegrations,
    getCourierIntegrationById,
    createCourierIntegration,
    updateCourierIntegration,
    deleteCourierIntegration
} from '../controllers/integrationController.js';

const router = express.Router();

// Route Format:
// REQ_TYPE ROUTE {PAYLOAD} : DESCRIPTION (SUCCESS STATUS CODE). [POTENTIAL QUERY PARAMETERS (are optional and will be fetched from url)]

// -------------------------------------------------------------------------------------------------

// ECOMMERCE INTEGRATIONS:
// GET /integrations/ecommerce/ : Returns all ecommerce integrations (200). [store, platform, title]
// GET /integrations/ecommerce/:id : Returns ecommerce integration with id (200).
// POST /integrations/ecommerce/ {integration} : Creates a new ecommerce integration (201).
// PATCH /integrations/ecommerce/:id {integration} : Updates ecommerce integration with id (200).
// DELETE /integrations/ecommerce/:id : Deletes ecommerce integration with id (200).

// Ecommerce Integration routes
router.get('/ecommerce', passport.authenticate('jwt', { session: false }), getAllEcommerceIntegrations);
router.get('/ecommerce/:id', passport.authenticate('jwt', { session: false }), getEcommerceIntegrationById);
router.post('/ecommerce', passport.authenticate('jwt', { session: false }), createEcommerceIntegration);
router.patch('/ecommerce/:id', passport.authenticate('jwt', { session: false }), updateEcommerceIntegration);
router.delete('/ecommerce/:id', passport.authenticate('jwt', { session: false }), deleteEcommerceIntegration);

// -------------------------------------------------------------------------------------------------

// COURIER INTEGRATIONS:
// GET /integrations/courier/ : Returns all courier integrations (200). [store, courierName, title]
// GET /integrations/courier/:id : Returns courier integration with id (200).
// POST /integrations/courier/ {integration} : Creates a new courier integration (201).
// PATCH /integrations/courier/:id {integration} : Updates courier integration with id (200).
// DELETE /integrations/courier/:id : Deletes courier integration with id (200).

// Courier Integration routes
router.get('/courier', passport.authenticate('jwt', { session: false }), getAllCourierIntegrations);
router.get('/courier/:id', passport.authenticate('jwt', { session: false }), getCourierIntegrationById);
router.post('/courier', passport.authenticate('jwt', { session: false }), createCourierIntegration);
router.patch('/courier/:id', passport.authenticate('jwt', { session: false }), updateCourierIntegration);
router.delete('/courier/:id', passport.authenticate('jwt', { session: false }), deleteCourierIntegration);

export default router;
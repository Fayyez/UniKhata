import express from "express";
import { authMiddleware } from "../middleware/auth";
import { Product } from "../models/Product";

//TODO: define the product model related services here
// all business logic should be in ../controllers/productController.js

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    
});

export default router;
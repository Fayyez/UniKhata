import express from "express";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();
// all of the following would be protected routes from now on
router.get('/all', authMiddleware, (req, res) => {
    //TODO: define the product returning service
    // basically get all products for all the stores that the user storeis integrated with
    //
})

export default router;
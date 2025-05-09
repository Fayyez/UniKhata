import express from 'express';
import { createUser, changeAvatar, getUserProfile, updateUserProfile, changePassword, deleteAccount, getUserProfileById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUserProfile);
router.get('/:uid', getUserProfileById);
router.post('/', createUser);
router.post('/change-password', changePassword);
router.post('/change-avatar', changeAvatar);
router.delete('/', deleteAccount);
router.patch('/', updateUserProfile);

export default router;
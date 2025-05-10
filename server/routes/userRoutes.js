import express from 'express';
import passport from 'passport';
import { createUser, changeAvatar, getUserProfile, updateUserProfile, changePassword, deleteAccount, getUserProfileById } from '../controllers/userController.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), getUserProfile);
router.get('/:uid', passport.authenticate('jwt', { session: false }), getUserProfileById);
router.post('/', passport.authenticate('jwt', { session: false }), createUser);
router.post('/change-password', passport.authenticate('jwt', { session: false }), changePassword);
router.post('/change-avatar', passport.authenticate('jwt', { session: false }), changeAvatar);
router.delete('/', passport.authenticate('jwt', { session: false }), deleteAccount);
router.patch('/', passport.authenticate('jwt', { session: false }), updateUserProfile);

export default router;
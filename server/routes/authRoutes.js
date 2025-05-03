import express from 'express';
import passport from 'passport';
import { generateTokens, refreshAccessToken } from '../utils/token.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Google login route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const tokens = generateTokens(req.user);
    // Redirect to frontend with tokens as URL parameters
    res.redirect(`http://localhost:5173/landing?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
});

// Manual login route
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const tokens = generateTokens(req.user);
    res.json(tokens);
});

// Register route for new users
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, name });
        await newUser.save();

        const tokens = generateTokens(newUser);
        res.status(201).json(tokens);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Refresh token route
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const newAccessToken = refreshAccessToken(refreshToken);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

// Add this new route before the export
router.get('/user-info', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
    });
});

export default router;

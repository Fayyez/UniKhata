import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const user = await User.findOne({ _id: userId, isDeleted: false }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User profile fetched successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const { name, email, avatar } = req.body;
        // Check if email is being updated and is unique
        if (email) {
            const existing = await User.findOne({ email, _id: { $ne: userId } });
            if (existing) return res.status(409).json({ message: 'Email already in use' });
        }
        const updated = await User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { $set: { ...(name && { name }), ...(email && { email }), ...(avatar && { avatar }) } },
            { new: true }
        ).select('-password');
        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User profile updated successfully', user: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Old and new password required' });
        const user = await User.findOne({ _id: userId, isDeleted: false });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const changeAvatar = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const { avatar } = req.body;
        if (!avatar) return res.status(400).json({ message: 'Avatar is required' });
        const user = await User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { $set: { avatar } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Avatar updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteAccount = async (req, res) => {
    try {   
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const user = await User.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserProfileById = async (req, res) => {
    try {
        const { uid } = req.params;
        if (!uid) return res.status(400).json({ message: 'User ID required' });
        const user = await User.findOne({ _id: uid, isDeleted: false }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User profile fetched successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, avatar, googleId } = req.body;
        if (!email || !password || !name) return res.status(400).json({ message: 'Name, email, and password are required' });
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already in use' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, avatar, googleId });
        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({ message: 'User created successfully', user: userObj });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

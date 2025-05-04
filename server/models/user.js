import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: { type: String, sparse: true, unique: true },
    email: { type: String, required: true },
    name: String,
    avatar: {type: String, default: "../public/user-profile-icon.png"},
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    createdAt: { type: Date, default: Date.now },
    lastEditedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false }
});

export default mongoose.model('User', userSchema);

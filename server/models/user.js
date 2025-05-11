import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: mongoose.Schema.Types.String, // user name
    password: { // user password
        type: mongoose.Schema.Types.String, default: "123"
    }, 
    email: { // user email
        type: mongoose.Schema.Types.String, required: true
    },
    avatar: { // user avatar link or path
        type: mongoose.Schema.Types.String, default: "../public/user-profile-icon.png"
    }, 
    googleId: { // google id for the user
        type: mongoose.Schema.Types.String, sparse: true, unique: true
    },
    stores: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Store'
    }], // stores owned by the user
    isDeleted: { // user is deleted or not
        type: mongoose.Schema.Types.Boolean, default: false
    }
}, { timestamps: true } // adds operational timestamps to the schema
);

export default mongoose.model('User', userSchema);

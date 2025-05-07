import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const userSchema = new mongoose.Schema({
    _id: { // user id
        type: Number, unique: true 
    },
    name: String, // user name
    password: { // user password
        type: String, default: ""
    }, 
    email: { // user email
        type: String, required: true 
    },
    avatar: { // user avatar link or path
        type: String, default: "../public/user-profile-icon.png"
    }, 
    googleId: { // google id for the user
        type: String, sparse: true, unique: true 
    },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }], // stores owned by the user
    isDeleted: { // user is deleted or not
        type: Boolean, default: false 
    }
}, { timestamps: true } // adds operational timestamps to the schema
);

userSchema.plugin(AutoIncrement, { id: 'user_id_counter', inc_field: '_id' }); // for auto incrementing the user id

export default mongoose.model('User', userSchema);

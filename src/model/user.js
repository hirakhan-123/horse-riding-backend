const mongoose = require('mongoose')
const { USER_ROLES, USER_VERIFIED_STATUS } = require('../constant');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: [USER_ROLES.ADMIN, USER_ROLES.RIDER],  
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    verified:{
        type: Boolean,
        default: USER_VERIFIED_STATUS.UNVERIFIED  
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('User', UserSchema); 

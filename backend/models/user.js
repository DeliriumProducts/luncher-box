const mongoose = require('mongoose');
const encryption = require("../utils/encryption");

const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

User.methods.authenticate = function (password) {
    let inputPasswordHash = encryption.hashPassword(password, this.salt);
    return inputPasswordHash === this.passwordHash;
};

module.exports = mongoose.model('User', User);    

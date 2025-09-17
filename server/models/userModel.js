// models/ userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing
const crypto = require('crypto'); // For generating reset tokens

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    cart: {
        type: Object,
        default: {},
    },
   
}, { timestamps: true  , minimize: false});



//Export the model
module.exports = mongoose.model('User', userSchema);
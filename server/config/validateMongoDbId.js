// config/validateMongoDbId.js

const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error('Invalid MongoDB ID');
    }
};

module.exports = validateMongoDbId;
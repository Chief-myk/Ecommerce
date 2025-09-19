// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        let { token } = req.cookies;
        //let token = req.headers.authorization.split(' ')[1];
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user by ID
        req.user = await User.findById(decoded?.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    // if (req?.headers?.authorization && req?.headers?.authorization?.startsWith('Bearer')) {
    // } else {
    //     return res.status(401).json({ message: 'No token, authorization denied' });
    // }
});
const adminAuth = asyncHandler(async (req, res, next) => {
    try {
        let {token} = req.cookies; // Changed from destructuring to direct access
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        
        const decoded = jwt.verify(token, "mysecretkey");
        
        if (!decoded || !decoded.email) {
            return res.status(401).json({ message: 'Invalid token, authorization not verified' });
        }
        
        req.adminEmail = decoded.email;
        
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Access denied, not admin' });
        }
        
        next();
    } catch (error) {
        console.error('AdminAuth middleware error:', error);
        return res.status(401).json({ message: 'Not ADMIN authorized, token failed' });
    }
});

module.exports = { authMiddleware, adminAuth };
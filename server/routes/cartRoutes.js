// cartRoutes.js
const express = require('express');
const { addToCart, removeFromCart, updateCartItem, getUserCart } = require('../controllers/cartCtrl');
const { adminAuth, authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/addToCart', authMiddleware, addToCart);
router.delete('/removeFromCart', authMiddleware, removeFromCart);
router.put('/updateCartItem', authMiddleware, updateCartItem);
router.post('/getUserCart', authMiddleware, getUserCart); // Changed from GET to POST to match frontend

module.exports = router;
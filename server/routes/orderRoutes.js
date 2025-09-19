// orderRoutes.js
const express = require('express');
const { placeOrder ,  userOrders , allOrders , updateStatus , placeOrderRazorPay , verifyPayment} = require('../controllers/OrderCtrl');
const { adminAuth, authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/placeOrder', authMiddleware, placeOrder);
router.get('/userOrders', authMiddleware, userOrders);
router.post("/razorpay" , authMiddleware ,placeOrderRazorPay)
router.post("/verify-payment" , authMiddleware ,verifyPayment)

router.get('/allOrders', allOrders);
router.post("/updateStatus" , updateStatus)

module.exports = router;
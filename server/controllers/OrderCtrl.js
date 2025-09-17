const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const Razorpay = require('razorpay');
const dotenv = require("dotenv")

dotenv.config()

const currency = "inr"
var razorpayinstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
    try {
        const { item, amount, address } = req.body;
        const userId = req.user.id;
        const orderData = {
            userId,
            items: item,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: new Date().getTime()
        }
        const newOrder = new Order(orderData);
        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData: {} });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error in placeOrder:', error); // Added logging
        res.status(500).json({ message: error.message });
    }
}

const userOrders = async (req, res) => {
    try {
        // const userId = req.user.id;
        const userId = req.user._id; // Ensure this is correctly set by authMiddleware
        console.log('Fetching orders for userId:', userId); // Added logging
        const orders = await Order.find({ userId });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in userOrders:', error); // Added logging
        res.status(500).json({ message: error.message });
    }
}

// For Admin
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in allOrders:', error); // Added logging
        res.status(500).json({ message: error.message });
    }
}

const updateStatus = async (req, res) => { 
    try {
        const {orderId, status} = req.body;
        console.log('Updating order:', orderId, 'to status:', status); // Added logging
        await Order.findByIdAndUpdate(orderId , { status });
        res.status(201).json({message : 'status Updated'}); // Fixed: moved status before json
    } catch (error) {
        console.error('Error in updateStatus:', error); // Added logging
        res.status(500).json({ message: error.message });
    }
}
const placeOrderRazorPay = async (req,res) => {
    try {
        const {item, amount, address} = req.body
        const userId = req.user.id
        const orderData = {
            items: item,
            amount,
            userId,
            address,
            paymentMethod : "Razorpay",
            payment:false,
            date :Date.now()
        }
        const newOrder = new Order(orderData)
        await newOrder.save()

        const options = {
            amount : amount * 100,
            currency : currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }
        await razorpayinstance.orders.create(options,(error,order)=>{
            if (error) {
                console.log('error' , error);
                return res.status(500).json(error)               
            }
            return res.status(200).json(order)

           
        })
    } catch (error) {
        console.log(error);
        
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user.id;
        const orderInfo  = await razorpayinstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await User.findByIdAndUpdate(userId, { cartData: {} });
            console.log('Payment verified for order:', razorpay_order_id); // Added logging
            
            return res.status(200).json({ message: 'Payment verified and order placed successfully' });
        } else {
            return res.status(400).json({ message: 'Payment not verified' });
        }
    } catch (error) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    placeOrder,
    userOrders,
    allOrders,
    updateStatus,
    placeOrderRazorPay,
    verifyPayment
}
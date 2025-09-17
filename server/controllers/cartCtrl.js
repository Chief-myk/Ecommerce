const User = require('../models/userModel');

const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        if (!itemId || !size) {
            return res.status(400).json({ message: "Product ID and size are required" });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let cart = user.cart || {};
        if (cart[itemId]) {
            if (cart[itemId][size]) {
                cart[itemId][size] += 1;
            } else {
                cart[itemId][size] = 1;
            }
        } else {
            cart[itemId] = {};
            cart[itemId][size] = 1;
        }

        await User.findByIdAndUpdate(req.user.id, { cart });
        return res.status(200).json({ message: "Product added to cart", cart });

    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        if (!itemId || !size) {
            return res.status(400).json({ message: "Item ID and size are required" });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let cartData = user.cart || {};
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        }
        
        await User.findByIdAndUpdate(req.user.id, { cart: cartData });
        return res.status(200).json({ message: "Item removed from cart", cart: cartData });
        
    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { itemId, productId, size, quantity } = req.body;
        const id = itemId || productId;
        
        if (!id || !size || quantity == null) {
            return res.status(400).json({ message: "Product ID, size, and quantity are required" });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let cartData = user.cart || {};
        
        if (!cartData[id]) {
            cartData[id] = {};
        }
        
        if (quantity <= 0) {
            delete cartData[id][size];
            if (Object.keys(cartData[id]).length === 0) {
                delete cartData[id];
            }
        } else {
            cartData[id][size] = quantity;
        }

        await User.findByIdAndUpdate(req.user.id, { cart: cartData });
        return res.status(200).json({ message: "Cart updated", cart: cartData });

    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getUserCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let cartData = user.cart || {};
        return res.status(200).json(cartData); // Changed to match frontend expectation

    } catch (error) {
        console.log('Error getting user cart:', error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { addToCart, removeFromCart, updateCartItem, getUserCart };
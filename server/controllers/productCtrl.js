// productCtrl.js
const Product = require('../models/productsModel'); 
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const uploadOnCloudinary = require('../config/cloudinary'); 

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, subCategory, sizes, color, brand, sold, bestSeller, quantity } = req.body;

    try {
        let image1, image2, image3, image4;

        if (req.files?.Image1?.[0]) {
            image1 = await uploadOnCloudinary(req.files.Image1[0].path);
        }
        if (req.files?.Image2?.[0]) {
            image2 = await uploadOnCloudinary(req.files.Image2[0].path);
        }
        if (req.files?.Image3?.[0]) {
            image3 = await uploadOnCloudinary(req.files.Image3[0].path);
        }
        if (req.files?.Image4?.[0]) {
            image4 = await uploadOnCloudinary(req.files.Image4[0].path);
        }

        let productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes || "[]"),
            image1: image1?.secure_url || null,
            image2: image2?.secure_url || null,
            image3: image3?.secure_url || null,
            image4: image4?.secure_url || null,
            color,
            Date: Date.now(),
            brand,
            sold: sold ? Number(sold) : 0,
            bestSeller: bestSeller === "true" || bestSeller === true,
            quantity: quantity ? Number(quantity) : 0
        };

        const createdProduct = await Product.create(productData);
        res.json({ success: true, message: 'Create Product Route', product: createdProduct });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const listProduct = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: `List product error : ${error.message}` });
    }
})

const RemoveProduct = asyncHandler(async (req, res) => { 
    try {
        let { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: "No Product Found" }); 
        }
        
        res.json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: `Delete product error: ${error.message}` });
    }
});

module.exports = {
    createProduct,
    listProduct,
    RemoveProduct 
};
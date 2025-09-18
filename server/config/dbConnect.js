// config/dbconnection.js

const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config();
const Product = require("../models/productsModel"); // adjust path

const dbConnect = async () => {
    try {
           const connection = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Mongoose Connected Successfully");
        // // 🔥 Drop the old slug index if it exists
        // try {
        //     await Product.collection.dropIndex("slug_1");
        //     console.log("Removed old slug index");
        // } catch (err) {
        //     if (err.code === 27) {
        //         console.log("No slug index found, skipping...");
        //     } else {
        //         console.error("Error dropping slug index:", err.message);
        //     }
        // }
    } catch (error) {
        console.error("Database Connection Error: ", error);
    }
};

module.exports = dbConnect;
// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

// Configure cloudinary (make sure you have these in your .env file)
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });
cloudinary.config({
    cloud_name: "ddx2sy7pi",
    api_key: "211656185643918",
    api_secret: "55lJoy6B4u5beMNdVb1i7JMhOvM",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log('No file path provided');
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log('File does not exist at path:', localFilePath);
            return null;
        }


        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "products", // Optional: organize uploads in folders
        });

        console.log('File uploaded successfully to cloudinary:', response.secure_url);

        // Remove the locally saved temporary file
        try {
            fs.unlinkSync(localFilePath);
            console.log('Local file deleted:', localFilePath);
        } catch (deleteError) {
            console.log('Error deleting local file:', deleteError.message);
        }

        return response;

    } catch (error) {
        console.error('Error uploading to cloudinary:', error);
        
        // Remove the locally saved temporary file in case of error
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log('Local file deleted after error:', localFilePath);
            }
        } catch (deleteError) {
            console.log('Error deleting local file after upload error:', deleteError.message);
        }
        
        return null;
    }
};

module.exports = uploadOnCloudinary ;
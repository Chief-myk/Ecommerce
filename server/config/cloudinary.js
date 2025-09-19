// // utils/cloudinary.js
// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');

// const dotenv = require('dotenv');
// dotenv.config();

// // Configure cloudinary (make sure you have these in your .env file)
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) {
//             console.log('No file path provided');
//             return null;
//         }

//         // Check if file exists
//         if (!fs.existsSync(localFilePath)) {
//             console.log('File does not exist at path:', localFilePath);
//             return null;
//         }


//         // Upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto",
//             folder: "products", // Optional: organize uploads in folders
//         });

//         console.log('File uploaded successfully to cloudinary:', response.secure_url);

//         // Remove the locally saved temporary file
//         try {
//             fs.unlinkSync(localFilePath);
//             console.log('Local file deleted:', localFilePath);
//         } catch (deleteError) {
//             console.log('Error deleting local file:', deleteError.message);
//         }

//         return response;

//     } catch (error) {
//         console.error('Error uploading to cloudinary:', error);
        
//         // Remove the locally saved temporary file in case of error
//         try {
//             if (fs.existsSync(localFilePath)) {
//                 fs.unlinkSync(localFilePath);
//                 console.log('Local file deleted after error:', localFilePath);
//             }
//         } catch (deleteError) {
//             console.log('Error deleting local file after upload error:', deleteError.message);
//         }
        
//         return null;
//     }
// };

// module.exports = uploadOnCloudinary ;


// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

// Configure cloudinary (make sure you have these in your .env file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log('No file path provided');
            return null;
        }

        // Convert to absolute path if it's relative
        const absolutePath = path.isAbsolute(localFilePath) ? localFilePath : path.resolve(localFilePath);
        
        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            console.log('File does not exist at path:', absolutePath);
            return null;
        }

        console.log('Uploading file from path:', absolutePath);

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto",
            folder: "products", // Optional: organize uploads in folders
        });

        console.log('File uploaded successfully to cloudinary:', response.secure_url);

        // Remove the locally saved temporary file
        try {
            fs.unlinkSync(absolutePath);
            console.log('Local file deleted:', absolutePath);
        } catch (deleteError) {
            console.log('Error deleting local file:', deleteError.message);
        }

        return response;

    } catch (error) {
        console.error('Error uploading to cloudinary:', error);
        
        // Remove the locally saved temporary file in case of error
        try {
            const absolutePath = path.isAbsolute(localFilePath) ? localFilePath : path.resolve(localFilePath);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log('Local file deleted after error:', absolutePath);
            }
        } catch (deleteError) {
            console.log('Error deleting local file after upload error:', deleteError.message);
        }
        
        return null;
    }
};

module.exports = uploadOnCloudinary;
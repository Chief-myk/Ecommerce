const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // slug: {
    //     type: String,
    //     lowercase: true,
    // },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
   
    subCategory: {
        type: String,
    },
    sizes: {
        type: Array,
        required: true
    },
   
    image1:{
        type:String
    },
    image2:{
        type:String
    },
    image3:{
        type:String
    },
    image4:{
        type:String
    },
    color: {
        type: String,
        // enum: ['red', 'blue', 'green', 'black', 'white', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'gold', 'silver'],
        required: true
    },
    Date:{
        type:Number,
        required:true
    },
    // ratings: [
    //     {
    //         star: Number,
    //         postedBy: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'User'
    //         }
    //     }
    // ],
    brand: {
        type: String,
        // enum: ['Apple', 'Samsung', 'Sony', 'LG', 'Nokia', 'HTC', 'Motorola'],
        required: true
    },
    // sold: {
    //     type: Number,
    //     default: 0,
    //     // select : false To hide this field from queries
    // },
    bestSeller: {
        type: Boolean
    },
     quantity: {
        type: Number,
        default: 0,
        min: 0,
    },

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);


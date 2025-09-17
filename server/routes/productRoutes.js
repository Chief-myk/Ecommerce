const express = require('express');
const { createProduct, listProduct, RemoveProduct} = require('../controllers/productCtrl');
const { adminAuth, authMiddleware } = require('../middlewares/authMiddleware');
const {getallUsers} = require("../controllers/userCtrl")
const upload = require("../middlewares/multer")

const router = express.Router();

router.post('/addproduct',upload.fields([
    {name: "Image1" , maxCount : 1},
    {name: "Image2" , maxCount : 1},
    {name: "Image3" , maxCount : 1},
    {name: "Image4" , maxCount : 1},
]) ,adminAuth ,createProduct);

router.get("/listProducts", listProduct)
router.delete("/removeProduct/:id", adminAuth , RemoveProduct)


module.exports = router;

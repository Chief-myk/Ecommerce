// userCtrl.js


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
        res.json({ message: "User deleted successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    validateMongoDbId(req.user._id);
    const user = await User.findByIdAndUpdate(req.user._id, {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
    });
    if (user) {
        res.json({ message: "User updated successfully" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true }
        );
        res.json({ message: "User blocked successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error blocking user" });
    }
});
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const user = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
        );
        res.json({ message: "User unblocked successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error unblocking user" });
    }
});

const handlRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    //    console.log('Cookie:', cookie);
    if (!cookie?.refreshToken) {
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    // console.log('Refresh Token:', refreshToken);
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new Error(
            "No refresh token found in database or user does not exist"
        );
    }
    jwt.verify(refreshToken, "mysecretkey", (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
            throw new Error("Invalid refresh token");
        }
        const newAccessToken = generatetoken(user?._id);
        res.json({ accessToken: newAccessToken });
    });
});

const updatePassword = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { password } = req.body;
    validateMongoDbId(id);
    if (!password) {
        throw new Error("Password is required");
    }
    const user = await User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    user.password = password;
    await user.save();
    res.json({ message: "Password updated successfully" });
});

const forgerotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found with this email");
    }
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, please follow this link to reset your password. This link is valid for 10 minutes only. <a href='http://localhost:5000/api/auth/reset-password/${token}'>Click here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetUrl,
        };
        sendEmail(data);
        res.json({ message: "Password reset link sent to your email", token });
    } catch (error) {
        throw new Error(error);
    }
});



deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handlRefreshToken,
    updatePassword,
    forgerotPasswordToken



// userModel.js


     // address: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Address', // Assuming you have an Address model
        // },
        // wishlist: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Product', // Assuming you have a Product model
        // },
        // isBlocked: {
        //     type: Boolean,
        //     default: false,
        // },
        // refreshToken: {
        //     type: String,
        // },
        // passwordChangedAt: {
        //     type: Date,
        // },
        // passwordResetToken: {
        //     type: String,
        // },
        // passwordResetExpires: {
        //     type: Date,
        // },


        
        userSchema.pre('save', async function (next) {
        
            if (!this.isModified('password')) {
                return next();
            }
        
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        });
        
        userSchema.methods.isPasswordMatched = async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        };
        userSchema.methods.createPasswordResetToken = function () {
            const resetToken = crypto.randomBytes(32).toString('hex');
            this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
            return resetToken;
        };
        


 // router.js 



 router.post('/forgot-password', forgerotPasswordToken);
router.get('/mail', sendEmail);
router.get('/:id',authMiddleware,isAdmin ,getUser);
router.delete('/:id',deleteUser);
router.put('/edit-user',authMiddleware , updateUser);
router.put('/block-user/:id',authMiddleware , isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware , isAdmin, unblockUser);
router.put('/password', authMiddleware, updatePassword);       















const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        // Filtering products based on query parameters
        // Example: /api/products?category=electronics&brand=apple
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query = product.find(JSON.parse(queryStr));

        // Sorting products if sort query is provided
        if (req.query.sort) {
            const SortBy = req.query.sort.split(',').join(' ');
            query = query.sort(SortBy);
        } else {
            query = query.sort('-createdAt');
        }


        // limiting fields if fields query is provided
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const ProductCount = await product.countDocuments();
            if (skip >= ProductCount) {
                return res.status(404).json({ message: 'This page does not exist' });

            }
        }

        const products = await query;
        // const products = await product.find(req.query);
        // const products = await product.find({
        //     brand: req.query.brand,
        //     category: req.query.category,
        // });
        // const products = await product.where("category").equals(req.query.category);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getSingleProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    try {
        const singleProduct = await product.findById(productId);
        if (!singleProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(singleProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});







    router.get("/all-users" , getallUsers);
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);
// Fixed controllers/userCtrl.js - Key changes marked with comments

const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generatetoken } = require("../config/jwt");
const { generatetokenforAdmin } = require("../config/jwt");
const validateMongoDbId = require("../config/validateMongoDbId");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const sendEmail = require("./emailCtrl");
const dotenv = require("dotenv")

dotenv.config()

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, mobile } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser) {
    throw new Error("User already exists!");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  } else {
    const hash_password = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hash_password, mobile });

    const token = generatetoken(newUser._id);
    
    // CONSISTENT: Use "token" cookie name like registration
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: false,
      // sameSite: "strict",

      // secure:true,
      // sameSite:"none",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    
    res.json({ newUser, token, message: "User created successfully!" });
    console.log("User created successfully!");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const finduser = await User.findOne({ email });
  if (!finduser) {
    throw new Error("User not found, please signup");
  }
  const isPasswordMatched = await bcrypt.compare(password, finduser.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }
  if (finduser && isPasswordMatched) {
    const token = generatetoken(finduser?._id);
    
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: false, 
      // sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.json({
      _id: finduser?._id,
      email: finduser?.email,
      username: finduser?.username, // ADDED: Include username
      mobile: finduser?.mobile,     // ADDED: Include mobile
      token: token,
    });
  } else {
    throw new Error("Invalid login credentials");
  }
  console.log(email, password);
});

const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token"); // FIXED: Clear "token" cookie
    console.log("User logged out successfully");
    return res.status(200).json({ message: "User Logout Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during logout" });
  }
});

const googleSignUp = asyncHandler(async (req, res) => {
  try {
    const { username, email } = req.body;
    let user = await User.findOne({ email });
    
    if (!user) {
      const newUser = await User.create({ 
        username, 
        email, 
        password: "google-auth", 
        mobile: "0000000000" 
      });
      user = newUser;
    }
    
    const token = generatetoken(user?._id);
    
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: false, // Set to true if using HTTPS
      // sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.json({
      _id: user?._id,
      username: user?.username,
      email: user?.email,
      mobile: user?.mobile,
      token: token,
      message: user ? "User logged in successfully" : "User created successfully"
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getallUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
});

// In your getCurrentUser controller
const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const { token } = req.cookies;
    console.log('Token from cookies:', token); // Debug log
    
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: 'No token found' });
    }
    
    try {
      const decoded = jwt.verify(token, "mysecretkey");
      console.log('Decoded token:', decoded); // Debug log
      
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log('User not found for id:', decoded.id);
        return res.status(404).json({ message: 'User not found' });
      }
      
      console.log('User found:', user); // Debug log
      res.json(user);
    } catch (jwtError) {
      console.log('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.log('Unexpected error in getCurrentUser:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const token = generatetokenforAdmin(email);
      
      res.cookie("token", token, {
        // httpOnly: true,
        // secure: true, // FIXED: Change to false for localhost (http)
        // sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      // FIXED: Return 200 status code for successful login
      return res.status(200).json({ 
        success: true,
        token,
        message: "Admin login successful"
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials' 
      });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ 
      success: false,
      message: "Server error during admin login" 
    });
  }
});

const getAdmin = async (req, res, next) => {
  try {
    const adminEmail = req.adminEmail;
    
    if (!adminEmail) {
      // FIXED: Return proper 401 status code instead of 200
      return res.status(401).json({ 
        success: false,
        message: "ADMIN IS NOT FOUND" 
      });
    }
    
    return res.status(200).json({
      success: true,
      email: adminEmail,
      role: "admin"
    });
  } catch (err) {
    console.error("getAdmin error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
module.exports = {
  createUser,
  loginUserCtrl,
  getallUsers,
  isAdmin,
  logout,
  googleSignUp,
  getAdmin,
  getCurrentUser
};
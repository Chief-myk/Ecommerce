// routes/authRoutes.js

const express = require('express');
const { createUser, loginUserCtrl, getallUsers, getCurrentUser, logout, isAdmin, googleSignUp, getAdmin } = require('../controllers/userCtrl');
const { authMiddleware, adminAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/logout', logout);
router.get('/all-users', getallUsers);
router.get("/getCurrentUser" ,getCurrentUser)

router.post('/google-signup', googleSignUp);

router.post("/adminLogin", isAdmin);
router.get("/admin", adminAuth, getAdmin);

module.exports = router;
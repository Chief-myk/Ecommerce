// config/jwt.js

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generatetoken = (id) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });
    } catch (error) {
        throw new Error("Error generating token");
    }
};

const generatetokenforAdmin = (email) => {
    try {
        return jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });
    } catch (error) {
        throw new Error("Error generating token");
    }
};

module.exports = { generatetoken, generatetokenforAdmin };
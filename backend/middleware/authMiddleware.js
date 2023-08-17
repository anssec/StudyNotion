const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

//auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Is missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token Is Invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
        success: false,
        message: "Something went wrong while validating the token",
      });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
}
//isInstructor

//isAdmin

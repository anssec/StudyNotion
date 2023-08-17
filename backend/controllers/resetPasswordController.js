const User = require("../models/userModel");
const mailsender = require("../utils/mailSender");
require("dotenv").config();
const bcrypt = require("bcrypt");
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const email = req.body.email;
    //check user for this email,email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is not registered",
      });
    }
    //generate token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    //create url
    const url = `${process.env.RESET_PASSWORD_FRONTEND_URL}/update-passsword/${token}`;
    //send mail containing url
    await mailsender(
      email,
      "Password Reset Link",
      `Password reset link ${url}`
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Email Send Successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Somethiing went wrong Email is not Send try again",
    });
  }
};

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //velidation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not match",
      });
    }
    //get userdetails from db using token
    const userDetails = await User.findOne({ token: token });

    //if no entry -invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired",
      });
    }
    //password hash
    const hashPassword = await bcrypt.hash(password, 10);
    //password update
    await User.findOneAndUpdate(
      { token: token },
      { password: hashPassword },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Password reset successfull",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong password not changed",
    });
  }
};

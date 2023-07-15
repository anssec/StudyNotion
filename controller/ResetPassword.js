const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const { email } = req.body.email;
    //check user from this email,email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your email is not registered",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containing the url
    await mailSender(
      email,
      "Password reset link",
      `Password reset link ${url}`
    );

    //return res
    return res.status(200).json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some thing went wrong",
    });
  }
};

//resetPassword
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      return res.status(402).json({
        success: false,
        message: "Password not match",
      });
    }
    //get user details from db using token
    const userDetail = await User.findOne({ token: token });

    //if no entry - invalid token
    if (!userDetail) {
      return res.status(402).json({
        success: false,
        message: "Password not match",
      });
    }

    //token time check
    if (userDetail.resetPasswordExpires < Date.now()) {
      return res.status(402).json({
        success: false,
        message: "Link expire",
      });
    }
    //hash passwd
    const hashPassword = await bcrypt.hash(password, 10);
    //passwd update
    await User.findOneAndUpdate(
      {
        token: token
      },
      {
        password: hashPassword
      },
      {
        new: true,
      }
    );

    //return response
    return res.status(201).json({
      success: true,
      message: "Password change successfully",
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some thing went wrong",
    });
  }
};

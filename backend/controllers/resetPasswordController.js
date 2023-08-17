const User = require("../models/userModel");
const mailsender = require("../utils/mailSender");
require("dotenv").config();

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    //check user for this email,email validation
    //generate token
    //update user by adding token and expiration time
    //create url
    //send mail containing url
    //return response

    const url = `${process.env.RESET_PASSWORD_FRONTEND_URL}/update-passsword/${token}`;
  } catch (error) {}
};
//resetPassword

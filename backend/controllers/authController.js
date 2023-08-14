const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");

//sendotp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user is already exist
    const checkUserPresent = await User.findOne({ email });

    //if user is already present
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Register",
      });
    }

    //generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //check unique otp
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry for otp
    const otpBody = await OTP.create(otpPayload);

    return res.status(200).json({
      success: true,
      message: "OTP Send",
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something Went wrong OTP not send ${error.message}`,
    });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something Went wrong try again later!`,
    });
  }
};
//login

//changePassword

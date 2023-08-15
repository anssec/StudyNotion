const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const Profile = require("../models/profileModel");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
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
    //data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    //validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //match password and confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and ConfirmPassword must be same",
      });
    }
    //check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already exist",
      });
    }
    //find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    //validate otp
    if (recentOtp.length == 0) {
      //otp not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp.otp) {
      //invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    //entry create in db
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashPassword,
      accountType,
      aditionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    //return res
    return res.status(200).json({
      success: true,
      message: "Registered Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something Went wrong try again later!`,
    });
  }
};

//login
exports.signUp = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;
    //validation data
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: `All fields are required ,please try again`,
      });
    }
    //user check exist or not
    const user = await User.findOne({ email }).populate("aditionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not registered`,
      });
    }
    //generate JWt After password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      //create cookie and send response
      return res.cookie("token", token, options).status(200).json({
        success: success,
        message: `Logged in successfully`,
        token,
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Something Went wrong try again later!`,
    });
  }
};
//changePassword

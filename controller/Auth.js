const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile=require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();

//* sendOtp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request body
    const { email } = req.body;

    // check if user is already exist
    const checkUserPresent = await User.findOne({ email });

    //if user already exist , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "user already registered",
      });
    }

    //? generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    //check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };

    // create entry for otp

    const otpBody = await OTP.create(otpPayload);

    // return response successfull
    res.status(200).json({
      success: true,
      message: "OTP send successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//*sign up
exports.signUp = async (req, res) => {
  try {

    //data fetch from req ki body
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

    //validate karo

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

    //2 password match krlo
    if(password!==confirmPassword){
      return res.status(400).json({
        success:false,
        message:'Password and ConfirmPassword value does not match, please try again'
      });
    };

    //check user already exist or not
    const existingUser=await User.findOne({email});
    if (existingUser){
      return res.status(400).json({
        success:false,
        message:'user is already registered',
      });
    };
    
    //find most recent otp stored for the user
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    
    //validate otp
    if(recentOtp.length==0){
      //OTP not found
      return res.status(400).json({
        success:false,
        message:'OTP Not found'
      });
    } else if (otp!==recentOtp.otp){
      //invalid OTP
      return res.status(400).json({
        success:false,
        message:'Invalid OTP'
      });
    };

    //Hash Password
    const hashedPassword=await bcrypt.hash(password,10);

    //entry create in DB 

    const profileDetails=await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null,
    });

    const user=await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password:hashedPassword,
      accountType,
      aditionalDetails:profileDetails._id,
      image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

    });
    //return res

    return res.status(200).json({
      success:true,
      message:'User is registered Successfully',
      user,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"User Cannot Be Registered, Please try again",
    })
  }
};

//*log in
exports.logIn=async (req,res)=>{
  try {
    //get data from req body
    const {email,password}=req.body;
    
    //validation data
    if(!email || !password){
      return res.status(403).json({
        success:false,
        message:'All fields are required'
      });
    };

    //user check exist or not
    const user=await User.findOne({email}).populate("additionalDetalis");
    if(!user){
      return res.status(401).json({
        success:false,
        message:'User is not registrerd, please signup first'
      });
    };

    //generate JWT, after password matching
    if(await bcrypt.compare(password, user.password)){
      const payload={
        email:user.email,
        id:user.id,
        role:user.role,
      }
      const token = jwt.sign(payload ,process.env.JWT_SECRET,{
        expiresIn:"2h",
      });
      
      user.token=token
    }
    //create cookie and send response


  } catch (error) {
    
  }
}

//*changePassword

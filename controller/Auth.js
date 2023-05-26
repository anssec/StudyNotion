const User=require('../models/User');
const OTP=require('../models/OTP');

//* sendOtp
exports.sendOTP=async(req,res)=>{

    //? fetch email from request body
    const {email}=req.body;

    //? check if user is already exist
    const checkUserPresent=await User.findOne({email});

    //! if user already exist , then return a response
    



}


//sign up


//log in


//changePassword

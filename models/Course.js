const mongoose=require('mongoose')

const courseSchema=new mongoose.Schema({

    courseName:{
        type:String,
        required:true,
        trim:true
    },
    courseDescription:{
        type:String,
        required:true,
        trim:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    whatYouWillLearn:{
        type:Number,
        required:true,
        trim:true
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:ratingAndReviews,

        }
    ],
    price:{
        type:Number,
    },
    thumbnil:{
        type:String
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        tef:"Tag"
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
        }
    ],
});

module.exports=mongoose.model("Course",courseSchema);
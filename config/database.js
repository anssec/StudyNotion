const mongoose=require('mongoose');
require('dotenv').config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGO_DB,({
        useNewUrlParser:true,
        UseUnifiedTopology:true
    }))
    .then(()=>console.log("DB Connected Successfully"))
    .catch(err=>{console.log(`DB connection failed ${err}`);
        process.exit(1);
    })
}

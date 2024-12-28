const { Mongoose, default: mongoose } = require("mongoose");


const dbConnect = async () =>{
    try {
        const conn=  await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.log('Database Connection FAILED!', error);
    }
};

module.exports= dbConnect;
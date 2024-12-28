const User= require("../models/userModel")
//const jwt= require("../config/jwtToken")
const jwt= require("jsonwebtoken")
const expressAsyncHandler = require("express-async-handler")

const authMiddleware = expressAsyncHandler(async (req,res,next) => {
    let token;

    // console.log(req.headers.authorization, "my token value");
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token= req.headers.authorization.split(" ")[1]; 
        
        try {
            if(token){
                const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
                const user= await User.findById(decoded?.id);
                req.user= user;
                next();
                
                 }
        } catch (error) {
            throw new Error(error,"Not authorized token expired, Please login again"); 
        }
    } else {
        throw new Error("There is no token attached to the header");
    }
});

const isAdmin= expressAsyncHandler(async (req,res,next)=>{
    const {email}= req.user;
    const adminUser= await User.findOne({email});
    if(adminUser.role !== "admin"){
        throw new Error("You are not the admin");
    }else{
        next();
    }
});

module.exports= {authMiddleware, isAdmin};
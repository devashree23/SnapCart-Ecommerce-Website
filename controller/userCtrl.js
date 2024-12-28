const expressAsyncHandler = require("express-async-handler");
const User= require("../models/userModel");
const jwt= require("jsonwebtoken");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const { validateMongodbId } = require("../util/validateMongodbId");
const { sendEmail } = require("./emailCtrl");
const crypto = require("crypto");
const { log } = require("console");

const createUser= expressAsyncHandler(async (req, res)=>{
    const email= req.body.email;
    const findUser=await User.findOne({email: email});
    if(!findUser){
        //creates new user
        const newUser=await User.create(req.body);
        res.json(newUser);
    }else{
        //existing user
        res.json({
            msg: "User already exists!",
            success: false
        });
    }
});

//login a user
const loginUserCtrl= expressAsyncHandler(async (req,res) => {
    const {email,password}= req.body; //destructuring
    const findUser=await User.findOne({email});
    //check if the user exists or not
    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken =await generateRefreshToken(findUser?.id);
        const updateToken = await User.findByIdAndUpdate(
            findUser.id,
            {
            refreshToken: refreshToken,
            },
            {
                new: true
            });
            //httpOnly ensures that the cookie is only accessible via HTTP req, not JS
            //max-age- the cookie will expire in 72 hrs frome time set
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                maxAge: 72*60*60*1000,
            });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile:findUser?.mobile,
            token: generateToken(findUser?._id)
            });
    }else{
        throw new Error("Invalid Credentials");
    }
});

//Get all users
const getAllUsers= expressAsyncHandler (async (req,res) => {
    try {
        const getUser= await User.find();
        res.json(getUser);
    } catch (error) {
        throw new Error(error);
    }
});

//get a single user 

const getSingleUser= expressAsyncHandler(async (req,res) => {
    
    const {id}= req.params;
    validateMongodbId(id);
    try {
        const getSingleUser= await User.findById(id);
        res.json({
            getSingleUser,
        })
        console.log(id);
    } catch (error) {
        throw new Error(error);
    }
});
//Update user 

const updatedUser= expressAsyncHandler(async (req,res) => {
    const {_id}= req.user;
    validateMongodbId(id);
    try {   
        const updatedUser= await User.findByIdAndUpdate(
            _id,
            {
                //optional chaining(?.) is a feature in js that allows you to safely properties or methods of an obj without causing errors if something is missing.
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error, "Updating error");
    }
});

//delete a user
const deleteSingleUser= expressAsyncHandler(async (req,res) => {
    console.log(req.params);
    
    const {id}= req.params;
    try {
        const deleteSingleUser= await User.findByIdAndDelete(id);
        res.json({
            deleteSingleUser,
        })
        console.log(id);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);
    try {
        const block= await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
                new:true,
            });
            res.json(
                {
                    message: "User is blocked",
                });
    } catch (error) {
        throw new Error(error, "Blocking error") ;
    }
    
});

const unblockUser= expressAsyncHandler(async (req,res) => {
    const {id}= req.params; 
    validateMongodbId(id);
    
    try {
        const unblock=await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
            new:true,
        });
        res.json({
            message: "User is Unblocked"
        });
    } catch (error) {
        throw new Error(error, "unBlocking error") ;
    }
});

//handle refresh token
//ecom sites usescookies to remember ur shopping cart as your browse
const handleRefreshToken= expressAsyncHandler(async (req,res) => {
    const cookie= req.cookies;
    console.log(cookie);
    //checks if cookie is undefined or null
    if(!cookie?.refreshToken){
        throw new Error("No Refresh Token in Cookies")
    }
    const refreshToken= cookie.refreshToken;
    console.log(refreshToken,"Refresh token!!!");

    const user= await User.findOne({refreshToken});
    //console.log(user,"USER TOKEN!");
    

    if(!user){
        throw new Error("No refresh token is present in the db or not matched")
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded)=>{
        if(err || user.id!== decoded.id){
            throw new Error("there is something wrong with the refresh token")
        }
        const accessToken = generateToken(user?.id);
        res.json({accessToken});
        
    });
    res.json(user);
    
});

//logout funtionality

const logout= expressAsyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("No Refresn token in cookie");
    }
    const refreshToken= cookie.refreshToken;
    const user= await User.findOne({refreshToken});
    //secure ensures the cookie is sent over secure HTTPS connections
    if(!user){ 
        res.clearCookie( "refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie( "refreshToken", {
        httpOnly: true,
        secure: true,
    });
        res.sendStatus(204); //forbidden

        console.log("Cookie deleted");   
});

//update password

const   updatePassword= expressAsyncHandler(async (req,res) => {
    const {_id}= req.user;
    const {password}= req.body;
    console.log(password,"password updation");
    
    validateMongodbId(_id);

    const user= await User.findById(_id);
    console.log(user,"Printing to check user");
   
    if(password){
        console.log(user.password,"Printing to check user1111");
        user.password= password;
        const updatedPassword= await user.save();
        res.json(updatedPassword);
    }else{
        res.json({
            message: user,
            status: "Not updated",
        });
    }

});


//forgot password
const forgotPasswordToken= expressAsyncHandler(async (req,res) => {
    console.log("Forgot password");
    const {email}= req.body;
    const user= await User.findOne({email});
    if(!user){
        throw new Error("User not found with this email!");
    }
    try {
        const token= await user.createPasswordResetToken();
        console.log(token,"Forgot password****");
        await user.save();
        const resetUrl= `Hi! Please follow this link to reset your password. This link is valid for 10 minutes from now on. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`
        const data={
            to: email,
            text: "HEY USER!!",
            subject: "Forgot my password",
            html: resetUrl,
        }
        sendEmail(data);
        res.json({message: "Sent!",token});
    } catch (error) {
        throw new Error(error, "Unable to reset password error!")
    }
});

const resetPassword= expressAsyncHandler(async (req,res) => {
    console.log("Reset password");
    
   const {password}= req.body;
   const {token} = req.params;
   const hashToken= crypto.createHash('sha256').update(token).digest('hex');
   const user= await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },   
   });
   if(!user){
    throw new Error("Token Expired! Please try again!");
    user.password= password;
    user.passwordResetToken= undefined;
    user.passwordResetExpires= undefined;
    await user.save();
    res.json(user);
   }
});


module.exports= {createUser , loginUserCtrl, getAllUsers, getSingleUser,updatedUser, deleteSingleUser,
    unblockUser,blockUser,handleRefreshToken,logout, updatePassword, forgotPasswordToken,resetPassword }

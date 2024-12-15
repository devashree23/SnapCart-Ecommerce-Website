const expressAsyncHandler = require("express-async-handler");
const User= require("../models/userModel");
const { generateToken } = require("../config/jwtToken");

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
    console.log(req.params);
    
    const {_id}= req.params;
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

const updateUser= expressAsyncHandler(async (req,res) => {
    const {_id}= req.params;
    try {
        const updatedUser= await User.findByIdAndUpdate(
            id,
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
        
    }
})

//delete a user
const deleteSingleUser= expressAsyncHandler(async (req,res) => {
    console.log(req.params);
    
    const {_id}= req.params;
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


module.exports= {createUser , loginUserCtrl, getAllUsers, getSingleUser,updateUser, deleteSingleUser}

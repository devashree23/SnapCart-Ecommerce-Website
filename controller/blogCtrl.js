const expressAsyncHandler = require('express-async-handler');
const Blog= require('../models/blogModel'); 
const User= require('../models/userModel');
const { validateMongodbId } = require('../util/validateMongodbId');

const createBlog= expressAsyncHandler(async (req,res) => {
    console.log("create a new blog");
    try {
        const createBlog= await Blog.create(req.body);
        res.json({  
            status: "success",
            createBlog,
        });

    } catch (error) {
        throw new Error(error,"Error while creating a new blog");
    }

});

const updateBlog= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);
    try {
        const updateBlog= await Blog.findByIdAndUpdate(id,req.body,{new:true});
        res.json({
            status:"success",
            updateBlog,
        });
    } catch (error) {
        throw new Error(error,"Error while updating blog");
    }
});

const getBlog= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);

   try {
    const getBlog= await Blog.findById(id).populate("likes").populate("dislikes ");
    const updateViews= await Blog.findByIdAndUpdate(id,    
        {
            $inc:{
                numViews : 1,
            }
    },{
        new: true   
    });
    res.json({
        status: "succes",
        getBlog,updateViews,
    });
   } catch (error) {
    throw new Error(error,"Cannot fetch the blog you are looking for...");
   } 
});

const getAllBlogs=expressAsyncHandler(async (req,res) => {
   try {
    const getBlogs= await Blog.find(req.body);
    res.json({
        message: "List of all the blogs as follows...",
        getBlogs,
    })
   } catch (error) {
    throw new Error(error,"Error while fetching all the blogs...")
   } 
});

const deleteblog= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    console.log(req.params,"***Delete blog***");

    validateMongodbId(id);
    
   try {
    const deleteBlog= await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
   } catch (error) {
    throw new Error(error,"Error while deleting the blog...")
   } 
});

const likeBlog= expressAsyncHandler(async (req,res) => {
   const {blogId}= req.body;
   
    //find the blog which you want to be liked
    const likeBlog= await Blog.findById(blogId);
    //find the login user
    const loginUserId= req?.user?._id;
    //find if the user has disliked the blog
    const isLiked= likeBlog?.isLiked;
    //find if the user has disliked the blog
    const alreadyDisliked= likeBlog?.dislikes.find(
        (userId)=> userId?.toString() === loginUserId?.toString()
    );
    if(alreadyDisliked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                dislikes: loginUserId
            },
            isDisliked: false
        },{
            new: true,
        }
    );
    res.json({blog,
        msg:"DISLKED BLOG"});
    }
    if(isLiked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                likes: loginUserId
            },
            isLiked: false,
        },{
            new: true,
        });
        res.json({blog,
            message:"LILKED BLOG"})
    }else{
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $push:{
                likes: loginUserId
            },
            isLiked: true,
        },{
            new: true,
        });
        res.json({blog,
            message:"LILKED BLOG"})
    }
});
const disLikeBlog = expressAsyncHandler(async (req,res) => {
   const {blogId}= req.body;
   
    //find the blog which you want to be liked
    const blog= await Blog.findById(blogId);
    //find the login user
    const loginUserId= req?.user?._id;
    //find if the user has disliked the blog
    const isDisliked= blog?.isDisliked;
    //find if the user has disliked the blog
    const alreadyLiked= blog?.likes.find(
        (userId)=> userId?.toString() === loginUserId?.toString()
    );
    if(alreadyLiked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                likes: loginUserId
            },
            isLiked: false
        },{
            new: true,
        }
    );
    res.json({blog,
        msg:"DISLKED BLOG"});
    }
    if(isDisliked){
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $pull:{
                dislikes: loginUserId
            },
            isDisliked: false,
        },{
            new: true,
        });
        res.json({blog,
            message:"LILKED BLOG"})
    }else{
        const blog= await Blog.findByIdAndUpdate(blogId,{
            $push:{
                dislikes: loginUserId
            },
            isDisliked: true,
        },{
            new: true,
        });
        res.json({blog,
            message:"LILKED BLOG"})
    }
});

module.exports= {createBlog,updateBlog,getBlog,getAllBlogs,deleteblog,likeBlog,disLikeBlog}
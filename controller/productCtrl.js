const expressAsyncHandler = require("express-async-handler");
const slugify= require("slugify");
const fs= require("fs");
const cloudinaryImg= require("../util/cloudinary");
const Product= require("../models/productModel");
const User= require("../models/userModel");

const createProduct= expressAsyncHandler(async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug= slugify(req.body.title);
        }
        const newProduct= await Product.create(req.body);
        res.json({
            newProduct
            // message: "PRODUCT LINK CREATED!!!",
        });
    } catch (error) {
        throw new Error(error,"product create error");
    }
});


const updateProduct= expressAsyncHandler(async (req,res) => {
    const id = req.product;
    console.log(req.product,"update param");
    
    try {
        if(req.body.title){
            req.body.slug= slugify(req.body.title);
        }
        const updateProduct= await Product.findOneAndUpdate({id}, req.body,{
            new: true,
        });
        res.json({
            message: updateProduct,
        });
    } catch (error) {
        throw new Error(error,"update product error")
    }
});

const deleteProduct= expressAsyncHandler(async (req,res) => {
    const id= req.product;
    console.log(req.product);
    
    try {
        if(req.body.title){
            req.body.slug= slugify(req.body.title);
        }
        const deleteProduct= await Product.findOneAndDelete({id}, req.body, {
            new: true
        });
        res.json(deleteProduct);

    } catch (error) {
        throw new Error(error, "deletion error");
    }


});

const getaProduct= expressAsyncHandler(async (req, res) => {
    const {id}= req.params;
    try {
        const findaProduct= await Product.findById(id);
        res.json({
            message: findaProduct,

        });
    } catch (error) {
        throw new Error(error,"finding single product error");
    }
});

const getallProduct= expressAsyncHandler(async (req,res) => {
    
    try {
        const queryObj= {...req.query };
        const excludeFields= ["sort","page","limit","fields"];  
        excludeFields.forEach((el) => delete queryObj[el]);

        console.log(queryObj,"Query Object");

        let queryStr= JSON.stringify(queryObj);
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`);
        console.log(queryStr,"Query conv to string");

        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if(req.query.sort){
            const sortBy= req.query.sort.split(",").join(" ");
            query= query.sort(sortBy);
        }else{
            query= query.sort("-createdAt")
        }

        //limiting the fields

        if(req.query.fields){
            const fields= req.query.fields.split(",").join(" ");
            query= query.select(fields);
        }else{
            query= query.select('rating');
        }

        //pagination
        const page= req.query.page;
        const limit= req.query.limit;
        const skip= (page-1)*limit;
        query= query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount= await Product.countDocuments();
            if(skip>=productCount){
                throw new Error("This page doesn't exist!")
            }
        }
        console.log(page,limit,skip);

        const product= await query;

        res.json(product);
        //const findAllProducts= await Product.find(queryObj);
        
    } catch (error) {
        throw new Error(error, "Finding the list of product error");
    }
});

const addToWishlist= expressAsyncHandler(async (req,res) => {
    const {_id}= req.user;
    const {prodId}= req.body;

   try {
    const user = await User.findById(_id);
    const conv = (id) => id.toString() === prodId;
    const alreadyAdded= user.wishlist.find(conv);

    if (alreadyAdded) {
        let user= await User.findOneAndUpdate( _id,
            {
                $pull: {wishlist:prodId},
            },
            {
                new:true,
            });
            res.json(user);
    } else {
        let user= await User.findOneAndUpdate(_id,
            {
                $push: { wishlist:prodId},
            },
            {
                new : true,
            }
        );
        res.json(user);
    }
   } catch (error) {
    throw new Error(error,"Error while adding the product to wishlist...")
   } 
});

//rating API not working need to check 
const rating= expressAsyncHandler(async (req,res) => {  
    const {_id}= req.user;
    const {star, prodId}=req.body;
    try {
        const product= await Product.findById(prodId);
        console.log(product,"Product CHECK KROOOO");
        console.log(product.rating,"Product Rating CHECK KROOOO");
        let alreadyRated= product.rating.find((ratings)=> ratings.postedBy.toString()=== _id.toString());
        console.log(alreadyRated,"Product Rating");
        if (!product.rating || product.rating.length === 0) {
            return res.status(400).json({ message: "No ratings found for this product." });
        }
        if(alreadyRated){
            const updateRating= await Product.updateOne(
                {
                rating:{
                    $elemMatch: alreadyRated,
                }
            },{
                $set: {
                    "rating.$.star": star,
                },
            },{
                new : true,
            });
            res.json(updateRating);
        }else{
            let rateProduct= await Product.findByIdAndUpdate(_id,
                {
                    $push:{
                        rating:{
                            star: star,
                            postedBy: _id,
                        },
                    },
                },{
                    new : true,
                }
            );
            res.json(rateProduct);
        }
    } catch (error) {
        throw new Error(error,"Error while rating the product...")
    }
});

// const getAllRating= expressAsyncHandler(async (params) => {
// timestamp-> 6:04:27
// });


const uploadImages= expressAsyncHandler(async (req,res) => {
    // console.log(req.headers,"Header...");
    // console.log(req.body,"Body...");
    
    const {id}= req.params;
    console.log(req.files,"upload files");

    try {
        const uploader= (path) => cloudinaryImg(path, "images");
        const urls= [];
        const files= req.files;

        for(const file of files){
            const {path}= files;
            const newPath= await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findProduct= await Product.findByIdAndUpdate(id,
            {
                images:urls.map((file)=>
                {
                    return file;
                }),
            },
            {
                new:true,
            }
        );
        res.json(findProduct);
    } catch (error) {
        throw new Error(error,"Error while uploading image...")
    }
    //not working need to review this code timestamp-7:05
});


module.exports= {createProduct,getaProduct,getallProduct,updateProduct,deleteProduct,addToWishlist,rating,uploadImages}
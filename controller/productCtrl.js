const expressAsyncHandler = require("express-async-handler");
const slugify= require("slugify");
const Product= require("../models/productModel");

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
            query= query.select('__v');
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



module.exports= {createProduct,getaProduct,getallProduct,updateProduct,deleteProduct}
const expressAsyncHandler = require("express-async-handler");
const Category = require("../models/prodcategoryModel");
const { validateMongodbId } = require("../util/validateMongodbId");

const createCategory= expressAsyncHandler(async (res,req) => {
    try {
        const createCategory= await Category.create(req.body);
        res.json({
            message: "Success",
            createCategory
        });
    } catch (error) {
        throw new Error(error,"Error Occured while building a category...");
    }
});

const updateCategory= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);

   try {
    const updateCategory= await Category.findByIdAndUpdate(id,req.body,{
        new: true,
    });
    res.json({
        message:"Update Succesfull",
        updateCategory
    });
   } catch (error) {
    throw new Error(error,"Error while updating category...");
   } 
});

const deleteCategory= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);
    try {
        const deleteCategory= await Category.findByIdAndDelete(id,req.body);
        res.json({
            message: "Sucessfully Deleted!",
            deleteCategory
        });
    } catch (error) {
        throw new Error(error,"Error while deleting category...")
    }
});

const getCategory= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);
   try {
    const getsingleCategory= await Category.findById(id);
    res.json({
        message: "Sucessfully Deleted!",
        getsingleCategory
    });

   } catch (error) {
    throw new Error(error, "Error while fetching the category")
   } 
});

const getAllCategory=expressAsyncHandler(async (req,res) => {
   try {
    const getAllCategory=await Category.find();
    res.json(getAllCategory);
   } catch (error) {
    throw new Error(error,"Error while fetching the list of categories...")
   } 
});

module.exports={createCategory,updateCategory,deleteCategory,getCategory,getAllCategory}
const expressAsyncHandler = require("express-async-handler");
const BrandBrand = require("../models/brandModel");
const { validateMongodbId } = require("../util/validateMongodbId");

const createBrand= expressAsyncHandler(async (res,req) => {
    try {
        const createBrand= await BrandBrand.create(req.body);
        res.json({
            message: "Success",
            createBrand
        });
    } catch (error) {
        throw new Error(error,"Error Occured while building a brand...");
    }
});

const updateBrand= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);

   try {
    const updateBrand= await BrandBrand.findByIdAndUpdate(id,req.body,{
        new: true,
    });
    res.json({
        message:"Update Succesfull",
        updateBrand
    });
   } catch (error) {
    throw new Error(error,"Error while updating brand...");
   } 
});

const deleteBrand= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);
    try {
        const deleteBrand= await BrandBrand.findByIdAndDelete(id,req.body);
        res.json({
            message: "Sucessfully Deleted!",
            deleteBrand
        });
    } catch (error) {
        throw new Error(error,"Error while deleting brand...")
    }
});

const getBrand= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    validateMongodbId(id);
   try {
    const getsingleBrand= await BrandBrand.findById(id);
    res.json({
        message: "Sucessfully Deleted!",
        getsingleBrand
    });

   } catch (error) {
    throw new Error(error, "Error while fetching the brand")
   } 
});

const getAllBrand=expressAsyncHandler(async (req,res) => {
   try {
    const getAllBrand=await BrandBrand.find();
    res.json(getAllBrand);
   } catch (error) {
    throw new Error(error,"Error while fetching the list of categories...")
   } 
});

module.exports={createBrand,updateBrand,deleteBrand,getBrand,getAllBrand}
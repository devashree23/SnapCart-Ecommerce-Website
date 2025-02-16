const expressAsyncHandler = require("express-async-handler");
const Coupon=require("../models/couponModel");
const { validateMongodbId } = require("../util/validateMongodbId");

const createCoupon= expressAsyncHandler(async (req,res) => {
    console.log("Entered in create coupon...");
    
   try {
    const newCoupon= await Coupon.create(req.body);
    res.json({
        newCoupon,
        message: "Success created a COUPON!"
    });
   } catch (error) {
    throw new Error(error,"Error while creating a coupon...");
   } 
});

const updateCoupon= expressAsyncHandler(async (req,res) => {
    console.log("Entered in updating coupon...");
    const { id }= req.params;
    validateMongodbId(id);
   try {
    const updateCoupon= await Coupon.findByIdAndUpdate(id,req.body,
        {
            new :true,
        }
    );
    res.json({updateCoupon , msg:"Successfully UPDATED!!!"});
   } catch (error) {
    throw new Error(error,"Error while updating coupon...");
   } 
});

const getAllCoupon= expressAsyncHandler(async (req,res) => {
    console.log("Entered fetching coupon details...");
    
    const {id}= req.params;
    try {
        const fetchCoupons= await Coupon.find();
        res.status(200).json({fetchCoupons,msg: "fetched all coupons"});
    } catch (error) {
       throw new Error("Error while fetching coupon...") ;
    }
});

const deleteCoupon= expressAsyncHandler(async (req,res) => {
    const {id}= req.params;
    try {
        const deleteCoupon= await Coupon.findByIdAndDelete(id);
        res.status(200).json({msg:"COUPON SUCCESSFULLY DELETED!",deleteCoupon });

    } catch (error) {
        throw new Error(error,"Error while deleting coupon...")
    }
})

module.exports= {createCoupon, updateCoupon, getAllCoupon, deleteCoupon, };

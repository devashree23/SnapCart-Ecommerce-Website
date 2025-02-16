const express=require("express");
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router= express.Router();

router.post('/create',authMiddleware,isAdmin, createCoupon);
router.put('/:id',authMiddleware,isAdmin, updateCoupon);
router.get('/',authMiddleware,isAdmin, getAllCoupon);
router.delete('/:id',authMiddleware,isAdmin, deleteCoupon);

module.exports= router;
const express= require("express");
const { createProduct,getaProduct,getallProduct,updateProduct ,deleteProduct, addToWishlist, rating, uploadImages} = require("../controller/productCtrl");
const {isAdmin,authMiddleware}= require("../middlewares/authMiddleware");
const { uploadPhoto, productImageResize } = require("../middlewares/uploadImagesMiddleware");
const router= express.Router();

router.post('/create',createProduct);
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array("images",10),productImageResize,uploadImages);
router.get('/:id',getaProduct);
router.put('/wishlist',authMiddleware,addToWishlist);
router.put('/rating',authMiddleware,rating);
router.put('/:id',authMiddleware,isAdmin,updateProduct);
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);
router.get('/',getallProduct);


module.exports= router;
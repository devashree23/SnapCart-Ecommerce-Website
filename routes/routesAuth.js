const express = require("express");
const { createUser,loginUserCtrl,getAllUsers,getSingleUser,deleteSingleUser, updatedUser,blockUser,unblockUser,handleRefreshToken, logout,updatePassword,forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, empytCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus} = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router= express.Router();
//routers for post, get methods


router.post('/register',createUser);
router.post('/forgot-password-token',forgotPasswordToken);
router.put('/reset-password-token/:token',resetPassword);

router.put('/updatePassword',authMiddleware ,updatePassword);
router.post('/login',loginUserCtrl);
router.post('/admin-login',loginAdmin);
router.post('/cart',authMiddleware, userCart);
router.post('/cart/apply-coupon',authMiddleware, applyCoupon);
router.post('/cart/cash-order',authMiddleware, createOrder);
router.get('/all-users',getAllUsers);
router.get('/refreshToken',handleRefreshToken);
router.get('/logout',logout);
router.get('/profile',authMiddleware,isAdmin,getSingleUser);
router.get('/wishlist',authMiddleware,getWishlist);
router.get('/getCart',authMiddleware,getUserCart);
router.get('/get-Orders',authMiddleware,getOrders);
router.delete('/empty-Cart',authMiddleware,emptyCart);
router.delete('/:id',deleteSingleUser);
router.put('/order/update-order/:id',authMiddleware,isAdmin,updateOrderStatus);
router.put('/edit-user',authMiddleware,updatedUser);
router.put('/save-user-address',authMiddleware,saveAddress);
router.put('/block-user/:id',authMiddleware,isAdmin ,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);

module.exports= router;
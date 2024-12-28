const express = require("express");
const { createUser,loginUserCtrl,getAllUsers,getSingleUser,deleteSingleUser, updatedUser,blockUser,unblockUser,handleRefreshToken, logout,updatePassword,forgotPasswordToken, resetPassword} = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router= express.Router();
//routers for post, get methods


router.post('/register',createUser);
router.post('/forgot-password-token',forgotPasswordToken);
router.put('/reset-password-token/:token',resetPassword);
router.put('/updatePassword',authMiddleware ,updatePassword);
router.post('/login',loginUserCtrl);
router.get('/all-users',getAllUsers);
router.get('/refreshToken',handleRefreshToken);
router.get('/logout',logout);
router.get('/profile',authMiddleware,isAdmin,getSingleUser);
router.delete('/:id',deleteSingleUser);
router.put('/edit-user',authMiddleware,updatedUser);
router.put('/block-user/:id',authMiddleware,isAdmin ,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);

module.exports= router;
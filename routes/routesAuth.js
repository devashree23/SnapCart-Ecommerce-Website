const express = require("express");
const { createUser,loginUserCtrl,getAllUsers,getSingleUser,deleteSingleUser, updateUser } = require("../controller/userCtrl");
const { authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router= express.Router();
//routers for post, get methods


router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/all-users',getAllUsers);
router.get('/:id',authMiddleware,isAdmin,getSingleUser);
router.delete('/:id',deleteSingleUser);
router.put('/edit-user',authMiddleware,updateUser);
module.exports= router;
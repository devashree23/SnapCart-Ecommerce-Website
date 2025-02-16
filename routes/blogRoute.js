const express= require("express");
const {createBlog, updateBlog, getBlog, getAllBlogs, deleteblog, likeBlog, disLikeBlog}= require("../controller/blogCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router= express.Router();

router.post('/createBlog',authMiddleware,isAdmin, createBlog);
router.put('/likes',authMiddleware, likeBlog);
router.put('/dislikes',authMiddleware, disLikeBlog);

router.put('/:id',authMiddleware,isAdmin, updateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlogs);
router.delete('/delete-blogs/:id', deleteblog);

module.exports= router;
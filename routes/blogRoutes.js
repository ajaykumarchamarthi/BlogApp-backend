const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const blogController = require("../controller/blogController");

router.post("/createblog", authController.protect, blogController.createBlog);
router.get("/allblogs", blogController.getAllBlogs);
router.patch("/editblog", authController.protect, blogController.editBlog);
router.delete("/deleteblog", authController.protect, blogController.deleteBlog);

router.patch("/like", authController.protect, blogController.createLike);
router.patch("/unlike", authController.protect, blogController.createUnlike);

module.exports = router;

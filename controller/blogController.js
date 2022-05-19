const Blog = require("../models/blogModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    status: "success",
    data: {
      blogs,
    },
  });
});

// exports.createBlog = catchAsync(async (req, res, next) => {
//   const blog = await Blog.create({
//     title: req.body.title,
//     category: req.body.category,
//     description: req.body.description,
//     picture: req.body.picture,
//     user: req.body.userId,
//   });
//   res.status(201).json({
//     status: "success",
//     data: {
//       blog,
//     },
//   });
// });

// exports.editBlog = catchAsync(async (req, res, next) => {
//   const blog = await Blog.findByIdAndUpdate(req.body.blogId, req.body.update);
//   res.status(200).json({
//     status: "success",
//     data: {
//       blog,
//     },
//   });
// });

exports.deleteBlog = catchAsync(async (req, res, next) => {
  await Blog.findByIdAndDelete(req.body.blogId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createLike = catchAsync(async (req, res, next) => {
  const { blogId, userId } = req.body;
  await Blog.findByIdAndUpdate(blogId, {
    $push: { likes: userId },
    new: true,
  });
  res.status(200).json({
    status: "success",
  });
});

exports.createUnlike = catchAsync(async (req, res, next) => {
  const { blogId, userId } = req.body;
  await Blog.findByIdAndUpdate(blogId, {
    $pull: { likes: userId },
  });
  res.status(200).json({
    status: "success",
  });
});

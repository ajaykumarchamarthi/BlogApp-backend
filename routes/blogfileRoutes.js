const express = require("express");
const router = express.Router();
const app = express();

// Importing Model
const Blog = require("./../models/blogModel");

// Importing authcontroller to protect the route
const authController = require("./../controller/authController");

const multer = require("multer");
const { s3Uploadv2 } = require("../s3Service");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3000000 },
});

router.post(
  "/createfileblog",
  authController.protect,
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;

      const result = await s3Uploadv2(file);

      const fileName = result.Location;

      const blog = await Blog.create({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        picture: fileName,
        user: req.body.userId,
      });

      res.status(201).json({
        status: "success",
        data: {
          blog,
        },
      });
    } catch (error) {
      res.status(401).json({
        status: "fail",
        message: "Blog not added successfully",
      });
    }
  }
);

router.patch(
  "/editfileblog",
  authController.protect,
  upload.single("file"),
  async (req, res) => {
    const file = req.file;

    const result = await s3Uploadv2(file);

    const fileName = result.Location;

    const blog = await Blog.findByIdAndUpdate(req.body.blogId, {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      picture: fileName,
      user: req.body.userId,
    });

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }
});

module.exports = router;

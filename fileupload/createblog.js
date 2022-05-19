const Blog = require("../models/blogModel");
const express = require("express");
const app = express();
const multer = require("multer");
const { s3Uploadv2 } = require("./../s3Service");

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

exports.createFileBlog =
  (upload.single("file"),
  async (req, res) => {
    try {
      console.log(req.file);

      const file = req.file;

      const result = await s3Uploadv2(file);

      const picture = result.Location;

      console.log(picture);

      res.json({
        status: "success",
        result,
      });
    } catch (error) {
      res.status(400).json({
        status: "fail",
        message: error,
      });
    }
  });

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

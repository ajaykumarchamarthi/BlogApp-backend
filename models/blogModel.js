const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "user must have a username"],
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    enum: ["Travel", "Food", "Nature", "Lifestyle", "Other"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Like must belong to a user"],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "likes",
    select: "_id userName",
  }).populate({
    path: "user",
    select: "_id userName email",
  });
  next();
});

module.exports = mongoose.model("BLOG", blogSchema);

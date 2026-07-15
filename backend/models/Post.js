const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  plainEnglish: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "General Legal Articles",
  },
  tags: [String],
  author: {
    name: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: Number,
    default: 3,
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);

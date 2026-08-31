const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
router.get("/", getPosts);
router.get("/categories", async (req, res) => {
  try {
    const Post = require("../models/Post");
    const categories = await Post.distinct("category");
    res.json(categories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/:slug", getPost);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
module.exports = router;

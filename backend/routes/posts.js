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
router.get("/:slug", getPost);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
module.exports = router;

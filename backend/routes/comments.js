const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// GET comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
      isApproved: true,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a comment (authenticated only)
router.post("/", auth, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;

    if (!content || !postId) {
      return res
        .status(400)
        .json({ error: "Post ID and content are required" });
    }

    const comment = new Comment({
      postId,
      author: req.user.id,
      content,
      parentCommentId: parentCommentId || null,
    });

    await comment.save();
    await comment.populate("author", "username");

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE comment (admin or comment author)
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Allow if admin or comment author
    if (
      req.user.role !== "admin" &&
      comment.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

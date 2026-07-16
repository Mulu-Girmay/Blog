const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// GET comments for a post (including replies)
router.get("/post/:postId", async (req, res) => {
  try {
    // Get top-level comments (parentCommentId = null)
    const comments = await Comment.find({
      postId: req.params.postId,
      isApproved: true,
      parentCommentId: null,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(100);

    // Get all replies for these comments
    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({
      parentCommentId: { $in: commentIds },
      isApproved: true,
    })
      .populate("author", "username")
      .sort({ createdAt: 1 });

    // Group replies by parent
    const repliesMap = {};
    replies.forEach((reply) => {
      const parentId = reply.parentCommentId.toString();
      if (!repliesMap[parentId]) repliesMap[parentId] = [];
      repliesMap[parentId].push(reply);
    });

    // Attach replies to comments
    const commentsWithReplies = comments.map((comment) => {
      const commentObj = comment.toObject();
      commentObj.replies = repliesMap[comment._id.toString()] || [];
      return commentObj;
    });

    res.json(commentsWithReplies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a comment or reply
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

    // If this is a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    await comment.populate("author", "username");

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Add reaction to comment
router.post("/:id/react", auth, async (req, res) => {
  try {
    const { reaction } = req.body;
    const validReactions = ["like", "love", "insightful", "question"];

    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ error: "Invalid reaction type" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const userId = req.user.id;
    const reactionField = `reactedBy.${reaction}`;
    const countField = `reactions.${reaction}`;

    // Check if user already reacted with this reaction
    const alreadyReacted = comment.reactedBy[reaction]?.includes(userId);

    if (alreadyReacted) {
      // Remove reaction
      comment[reactionField] = comment.reactedBy[reaction].filter(
        (id) => id.toString() !== userId,
      );
      comment[countField] = Math.max(0, (comment[countField] || 0) - 1);
    } else {
      // Add reaction
      comment[reactionField].push(userId);
      comment[countField] = (comment[countField] || 0) + 1;
    }

    await comment.save();

    res.json({
      reaction,
      count: comment.reactions[reaction],
      reacted: !alreadyReacted,
    });
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

    // Delete all replies first
    if (comment.replies && comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// GET comments for a post (including replies)
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
      isApproved: true,
      parentCommentId: null,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(100);

    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({
      parentCommentId: { $in: commentIds },
      isApproved: true,
    })
      .populate("author", "username")
      .sort({ createdAt: 1 });

    const repliesMap = {};
    replies.forEach((reply) => {
      const parentId = reply.parentCommentId.toString();
      if (!repliesMap[parentId]) repliesMap[parentId] = [];
      repliesMap[parentId].push(reply);
    });

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

async function toggleReaction(req, res) {
  try {
    console.log("📡 Reaction request received for comment:", req.params.id);
    console.log("📡 Reaction type:", req.body.reaction);
    console.log("📡 User:", req.user.id);

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

    // Initialize reactions if they don't exist
    if (!comment.reactions) {
      comment.reactions = { like: 0, love: 0, insightful: 0, question: 0 };
    }
    if (!comment.reactedBy) {
      comment.reactedBy = { like: [], love: [], insightful: [], question: [] };
    }

    // Check if user already reacted with this reaction
    const alreadyReacted = comment.reactedBy[reaction]?.includes(userId);

    if (alreadyReacted) {
      // Remove reaction
      comment.reactedBy[reaction] = comment.reactedBy[reaction].filter(
        (id) => id.toString() !== userId,
      );
      comment.reactions[reaction] = Math.max(
        0,
        (comment.reactions[reaction] || 0) - 1,
      );
      console.log(`👎 Removed ${reaction} reaction`);
    } else {
      // Check if user reacted with something else and remove that
      for (const r of validReactions) {
        if (r !== reaction && comment.reactedBy[r]?.includes(userId)) {
          comment.reactedBy[r] = comment.reactedBy[r].filter(
            (id) => id.toString() !== userId,
          );
          comment.reactions[r] = Math.max(0, (comment.reactions[r] || 0) - 1);
          console.log(`👎 Removed previous ${r} reaction`);
        }
      }

      // Add new reaction
      comment.reactedBy[reaction].push(userId);
      comment.reactions[reaction] = (comment.reactions[reaction] || 0) + 1;
      console.log(`👍 Added ${reaction} reaction`);
    }

    await comment.save();
    console.log("✅ Reaction saved successfully");

    res.json({
      reaction,
      count: comment.reactions[reaction],
      reacted: !alreadyReacted,
    });
  } catch (err) {
    console.error("❌ Reaction error:", err);
    res.status(500).json({ error: err.message });
  }
}

router.post("/:id/react", auth, toggleReaction);
router.post("/react/:id", auth, toggleReaction);

// DELETE comment (admin or comment author)
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      req.user.role !== "admin" &&
      comment.author.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

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

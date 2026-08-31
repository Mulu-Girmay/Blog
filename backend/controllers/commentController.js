const Comment = require("../models/Comment");

exports.getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId, isApproved: true, parentCommentId: null })
      .populate("author", "username").sort({ createdAt: -1 }).limit(100);
    const replies = await Comment.find({ parentCommentId: { $in: comments.map((comment) => comment._id) }, isApproved: true })
      .populate("author", "username").sort({ createdAt: 1 });
    const repliesMap = replies.reduce((map, reply) => {
      const parentId = reply.parentCommentId.toString();
      (map[parentId] ||= []).push(reply);
      return map;
    }, {});
    res.json(comments.map((comment) => ({ ...comment.toObject(), replies: repliesMap[comment._id.toString()] || [] })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    if (!content || !postId) return res.status(400).json({ error: "Post ID and content are required" });
    const comment = await Comment.create({ postId, author: req.user.id, content, parentCommentId: parentCommentId || null });
    if (parentCommentId) await Comment.findByIdAndUpdate(parentCommentId, { $push: { replies: comment._id } });
    await comment.populate("author", "username");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleReaction = async (req, res) => {
  try {
    const { reaction } = req.body;
    const validReactions = ["like", "love", "insightful", "question"];
    if (!validReactions.includes(reaction)) return res.status(400).json({ error: "Invalid reaction type" });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    const userId = req.user.id;
    for (const type of validReactions) {
      comment.reactions[type] ||= 0;
      comment.reactedBy[type] ||= [];
    }
    const alreadyReacted = comment.reactedBy[reaction].some((id) => id.toString() === userId);
    if (alreadyReacted) {
      comment.reactedBy[reaction] = comment.reactedBy[reaction].filter((id) => id.toString() !== userId);
      comment.reactions[reaction] = Math.max(0, comment.reactions[reaction] - 1);
    } else {
      for (const type of validReactions) {
        if (type !== reaction && comment.reactedBy[type].some((id) => id.toString() === userId)) {
          comment.reactedBy[type] = comment.reactedBy[type].filter((id) => id.toString() !== userId);
          comment.reactions[type] = Math.max(0, comment.reactions[type] - 1);
        }
      }
      comment.reactedBy[reaction].push(userId);
      comment.reactions[reaction] += 1;
    }
    await comment.save();
    res.json({ reaction, count: comment.reactions[reaction], reacted: !alreadyReacted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (req.user.role !== "admin" && comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (comment.replies.length) await Comment.deleteMany({ _id: { $in: comment.replies } });
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    // ✅ NEW: For nested replies
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    // ✅ NEW: For tracking replies
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    // ✅ NEW: Reactions
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      insightful: { type: Number, default: 0 },
      question: { type: Number, default: 0 },
    },
    // ✅ NEW: Track who reacted (to prevent duplicate reactions)
    reactedBy: {
      like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      love: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      insightful: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      question: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Comment", CommentSchema);

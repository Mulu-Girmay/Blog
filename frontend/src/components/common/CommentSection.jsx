import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaClock,
  FaTrash,
  FaReply,
  FaThumbsUp,
  FaHeart,
  FaLightbulb,
  FaQuestionCircle,
  FaThumbsUp as FaThumbsUpSolid,
  FaHeart as FaHeartSolid,
  FaLightbulb as FaLightbulbSolid,
  FaQuestionCircle as FaQuestionCircleSolid,
  FaEllipsisH,
  FaSmile,
  FaPaperPlane,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns"; // ✅ FIXED: no space
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const textareaRef = useRef(null);
  const replyTextareaRef = useRef(null);

  const visibleComments = showAllComments ? comments : comments.slice(0, 5);
  const hasMoreComments = comments.length > 5;

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/comments", {
        postId,
        content: newComment.trim(),
      });
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
      setShowEmojiPicker(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to reply");
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Please write a reply");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/comments", {
        postId,
        content: replyContent.trim(),
        parentCommentId: replyingTo,
      });

      const updatedComments = comments.map((comment) => {
        if (comment._id === replyingTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), res.data],
          };
        }
        return comment;
      });

      setComments(updatedComments);
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Reply added!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      const updatedComments = comments
        .filter((c) => c._id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r._id !== commentId) || [],
        }));
      setComments(updatedComments);
      toast.success("Comment deleted");
      setActiveDropdown(null);
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };
  const handleReact = async (commentId, reaction) => {
    if (!user) {
      toast.error("Please login to react");
      return;
    }
    try {
      console.log(`👍 Reacting to comment ${commentId} with ${reaction}`);
      const res = await api.post(`/comments/${commentId}/react`, { reaction });
      console.log("✅ Reaction response:", res.data);

      // Update comment reactions
      const updatedComments = comments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            reactions: {
              ...comment.reactions,
              [reaction]: res.data.count,
            },
          };
        }
        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply._id === commentId) {
              return {
                ...reply,
                reactions: {
                  ...reply.reactions,
                  [reaction]: res.data.count,
                },
              };
            }
            return reply;
          });
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });

      setComments(updatedComments);
    } catch (err) {
      console.error("❌ Reaction error:", err.response?.data || err.message);
      if (err.response?.status === 404) {
        toast.error("Reaction endpoint not found. Please check server.");
      } else if (err.response?.status === 401) {
        toast.error("Please login to react");
      } else {
        toast.error(err.response?.data?.error || "Failed to react");
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-3 border-gold/20 border-t-burgundy rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-gold/20 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-serif font-bold text-ink">Comments</h3>
          <span className="px-3 py-1 bg-ink/5 rounded-full text-sm text-ink/50">
            {comments.length}
          </span>
        </div>
        <button
          onClick={() => {
            document
              .querySelector(".comment-form")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-sm text-burgundy hover:underline font-serif"
        >
          Add Comment
        </button>
      </div>

      {/* Comment Form - Social Media Style */}
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 text-lg font-serif font-bold text-burgundy">
              {user.username?.charAt(0).toUpperCase() || "👤"}
            </div>
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={newComment ? 3 : 1}
                className="w-full px-4 py-3 bg-white/50 dark:bg-ink/5 border border-gold/20 rounded-2xl focus:outline-none focus:border-burgundy/50 focus:ring-2 focus:ring-burgundy/10 transition-all resize-none text-ink placeholder:text-ink/40"
                onFocus={() => setShowEmojiPicker(false)}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-ink/40 hover:text-burgundy transition-colors p-2 rounded-full hover:bg-burgundy/5"
                  >
                    <FaSmile />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-[-200px] left-0 right-0 sm:right-auto bg-cream dark:bg-ink/10 border border-gold/20 rounded-lg shadow-lg p-3 z-10 w-full sm:w-64">
                      <div className="flex flex-wrap gap-1">
                        {[
                          "😊",
                          "😂",
                          "❤️",
                          "👍",
                          "👏",
                          "🔥",
                          "💡",
                          "🤔",
                          "😮",
                          "🙏",
                          "⚖️",
                          "📚",
                        ].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl hover:bg-burgundy/10 rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2 bg-burgundy text-white px-6 py-2 rounded-full hover:bg-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-sm" />
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-cream dark:bg-ink/5 p-6 rounded-2xl mb-8 text-center border border-gold/10">
          <p className="text-ink/60">
            Join the conversation!{" "}
            <Link
              to="/login"
              className="text-burgundy hover:underline font-serif"
            >
              Login
            </Link>{" "}
            or{" "}
            <Link
              to="/login"
              className="text-burgundy hover:underline font-serif"
            >
              Register
            </Link>{" "}
            to comment
          </p>
        </div>
      )}

      {/* Show/Hide Comments Toggle */}
      {comments.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-ink/40">
            Showing {visibleComments.length} of {comments.length} comments
          </span>
          {hasMoreComments && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="flex items-center gap-2 text-sm text-burgundy hover:underline font-serif transition-colors"
            >
              {showAllComments ? (
                <>
                  <FaChevronUp /> Show Less
                </>
              ) : (
                <>
                  <FaChevronDown /> Show All ({comments.length})
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Comments List - Social Media Style */}
      <div className="space-y-4">
        {visibleComments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-ink/40">
              No comments yet. Start the conversation!
            </p>
          </div>
        ) : (
          visibleComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              onReply={(id) => {
                setReplyingTo(id);
                setReplyContent("");
                setTimeout(() => replyTextareaRef.current?.focus(), 100);
              }}
              onDelete={handleDelete}
              onReact={handleReact}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
              submitting={submitting}
              isAdmin={user?.role === "admin"}
              replyTextareaRef={replyTextareaRef}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              postAuthorId={
                comments.length > 0 ? comments[0]?.author?._id : null
              }
            />
          ))
        )}
      </div>

      {/* Show All button at bottom */}
      {hasMoreComments && !showAllComments && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAllComments(true)}
            className="text-sm text-ink/40 hover:text-burgundy transition-colors font-serif"
          >
            Load all {comments.length} comments
          </button>
        </div>
      )}
    </div>
  );
}

// Individual Comment Item - Social Media Style
function CommentItem({
  comment,
  user,
  onReply,
  onDelete,
  onReact,
  replyingTo,
  replyContent,
  setReplyContent,
  handleReply,
  submitting,
  isAdmin,
  replyTextareaRef,
  activeDropdown,
  setActiveDropdown,
  postAuthorId,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const isAuthor = user?._id === comment.author?._id;
  const isCommentAuthor = comment.author?._id === postAuthorId;
  const canDelete = isAdmin || isAuthor;
  const totalReactions = Object.values(comment.reactions || {}).reduce(
    (a, b) => a + b,
    0,
  );

  const getReactionSummary = () => {
    const reactions = comment.reactions || {};
    const types = [];
    if (reactions.like > 0) types.push("👍");
    if (reactions.love > 0) types.push("❤️");
    if (reactions.insightful > 0) types.push("💡");
    if (reactions.question > 0) types.push("❓");
    return types.join("");
  };

  const reactionSummary = getReactionSummary();

  return (
    <div className="group bg-cream/20 dark:bg-ink/5 rounded-2xl p-4 hover:bg-cream/40 dark:hover:bg-ink/10 transition-colors">
      {/* Comment Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy/20 to-gold/20 flex items-center justify-center flex-shrink-0 text-lg font-serif font-bold text-burgundy">
            {comment.author?.username?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-serif font-semibold text-ink text-sm">
                {comment.author?.username || "Anonymous"}
              </span>
              {comment.author?.role === "admin" && (
                <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
              {isCommentAuthor && (
                <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full">
                  Author
                </span>
              )}
              <span className="text-xs text-ink/40">•</span>
              <span className="text-xs text-ink/40 flex items-center gap-1">
                <FaClock className="text-[10px]" />
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Comment Content */}
            <p className="mt-1 text-ink/80 text-sm leading-relaxed break-words">
              {comment.content}
            </p>

            {/* Actions Bar */}
            <div className="flex items-center gap-1 mt-3 flex-wrap">
              <ReactionButton
                reaction="like"
                comment={comment}
                onReact={onReact}
                user={user}
              />
              <ReactionButton
                reaction="love"
                comment={comment}
                onReact={onReact}
                user={user}
              />
              <ReactionButton
                reaction="insightful"
                comment={comment}
                onReact={onReact}
                user={user}
              />
              <ReactionButton
                reaction="question"
                comment={comment}
                onReact={onReact}
                user={user}
              />

              {/* Reply Button */}
              {user && (
                <button
                  onClick={() => {
                    setShowReplyForm(!showReplyForm);
                    onReply(comment._id);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-ink/40 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/5"
                >
                  <FaReply className="text-[10px]" /> Reply
                </button>
              )}

              {/* More Options */}
              {canDelete && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === comment._id ? null : comment._id,
                      )
                    }
                    className="p-1 text-ink/30 hover:text-ink/60 transition-colors rounded-full hover:bg-ink/5"
                  >
                    <FaEllipsisH className="text-xs" />
                  </button>
                  {activeDropdown === comment._id && (
                    <div className="absolute right-0 mt-1 w-40 bg-cream dark:bg-ink/10 border border-gold/20 rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => {
                          onDelete(comment._id);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                      >
                        <FaTrash className="text-xs" /> Delete Comment
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reaction Summary */}
            {totalReactions > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-ink/40">
                <span className="flex items-center gap-0.5">
                  {reactionSummary}
                </span>
                <span>•</span>
                <span>
                  {totalReactions}{" "}
                  {totalReactions === 1 ? "reaction" : "reactions"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && replyingTo === comment._id && (
        <form onSubmit={handleReply} className="mt-4 ml-6 sm:ml-12">
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-burgundy">
              {user?.username?.charAt(0).toUpperCase() || "👤"}
            </div>
            <div className="flex-1">
              <textarea
                ref={replyTextareaRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full px-4 py-2 bg-white/50 dark:bg-ink/5 border border-gold/20 rounded-xl focus:outline-none focus:border-burgundy/50 focus:ring-2 focus:ring-burgundy/10 transition-all resize-none text-ink placeholder:text-ink/40"
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="bg-burgundy text-white px-4 py-1.5 rounded-full text-sm hover:bg-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <FaPaperPlane className="text-xs" /> Reply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    onReply(null);
                  }}
                  className="text-sm text-ink/40 hover:text-ink/70 transition-colors px-3 py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 sm:ml-12 mt-3 space-y-3 border-l-2 border-gold/20 pl-3 sm:pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              user={user}
              onReply={onReply}
              onDelete={onDelete}
              onReact={onReact}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
              submitting={submitting}
              isAdmin={isAdmin}
              replyTextareaRef={replyTextareaRef}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              postAuthorId={postAuthorId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Reaction Button Component
function ReactionButton({ reaction, comment, onReact, user }) {
  const config = {
    like: { icon: FaThumbsUp, label: "Like", activeColor: "text-blue-500" },
    love: { icon: FaHeart, label: "Love", activeColor: "text-red-500" },
    insightful: {
      icon: FaLightbulb,
      label: "Insightful",
      activeColor: "text-yellow-500",
    },
    question: {
      icon: FaQuestionCircle,
      label: "Question",
      activeColor: "text-purple-500",
    },
  };

  const { icon: Icon, label, activeColor } = config[reaction];
  const count = comment.reactions?.[reaction] || 0;
  const isActive = count > 0;

  return (
    <button
      onClick={() => onReact(comment._id, reaction)}
      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full transition-all hover:bg-ink/5 ${
        isActive ? activeColor : "text-ink/30 hover:text-ink/60"
      }`}
      title={label}
      disabled={!user}
    >
      <Icon className={`text-xs ${isActive ? "fill-current" : ""}`} />
      {count > 0 && <span className="font-medium">{count}</span>}
    </button>
  );
}

import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
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

      // Update comments with new reply
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
      // Remove comment from state
      const updatedComments = comments
        .filter((c) => c._id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies?.filter((r) => r._id !== commentId) || [],
        }));
      setComments(updatedComments);
      toast.success("Comment deleted");
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
      const res = await api.post(`/comments/${commentId}/react`, { reaction });

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
        // Check replies
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
      toast.error("Failed to react");
    }
  };

  const getReactionIcon = (reaction, count, commentId) => {
    const icons = {
      like: {
        regular: FaThumbsUp,
        solid: FaThumbsUpSolid,
        color: "text-blue-500",
      },
      love: { regular: FaHeart, solid: FaHeartSolid, color: "text-red-500" },
      insightful: {
        regular: FaLightbulb,
        solid: FaLightbulbSolid,
        color: "text-yellow-500",
      },
      question: {
        regular: FaQuestionCircle,
        solid: FaQuestionCircleSolid,
        color: "text-purple-500",
      },
    };

    const Icon = count > 0 ? icons[reaction].solid : icons[reaction].regular;
    const color = count > 0 ? icons[reaction].color : "text-ink/40";

    return (
      <button
        onClick={() => handleReact(commentId, reaction)}
        className={`flex items-center gap-1 text-sm transition-colors ${color} hover:opacity-70`}
      >
        <Icon /> {count > 0 && count}
      </button>
    );
  };

  if (loading)
    return (
      <div className="text-center py-4 text-ink/40">Loading comments...</div>
    );

  return (
    <div className="mt-12 border-t border-gold/20 pt-8">
      <h3 className="text-2xl font-serif font-bold mb-6 text-ink">
        💬 Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this article..."
            rows={3}
            className="w-full px-4 py-3 bg-white/70 dark:bg-ink/10 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 resize-y text-ink placeholder:text-ink/40"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="bg-cream dark:bg-ink/5 p-4 rounded-lg mb-8 text-center">
          <p className="text-ink/60">
            Please{" "}
            <Link to="/login" className="text-burgundy hover:underline">
              login
            </Link>{" "}
            or{" "}
            <Link to="/login" className="text-burgundy hover:underline">
              register
            </Link>{" "}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-ink/40 text-center py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              user={user}
              onReply={(id) => {
                setReplyingTo(id);
                setReplyContent("");
              }}
              onDelete={handleDelete}
              onReact={handleReact}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReply={handleReply}
              submitting={submitting}
              isAdmin={user?.role === "admin"}
              postAuthor={user?._id === comment.author?._id}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Individual Comment Component
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
  postAuthor,
}) {
  const isAuthor = user?._id === comment.author?._id;
  const canDelete = isAdmin || isAuthor || postAuthor;

  return (
    <div className="bg-cream/30 dark:bg-ink/5 p-4 rounded-lg">
      {/* Main comment */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-ink/50">
            <FaUser className="text-xs" />
            <span className="font-serif font-semibold text-ink">
              {comment.author?.username || "Anonymous"}
              {postAuthor && (
                <span className="ml-2 text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">
                  Author
                </span>
              )}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FaClock className="text-[10px]" />
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="mt-1 text-ink/80">{comment.content}</p>

          {/* Reactions & Actions */}
          <div className="flex items-center gap-4 mt-2">
            {getReactionButton("like", comment, onReact)}
            {getReactionButton("love", comment, onReact)}
            {getReactionButton("insightful", comment, onReact)}
            {getReactionButton("question", comment, onReact)}

            {user && (
              <button
                onClick={() => onReply(comment._id)}
                className="flex items-center gap-1 text-sm text-ink/40 hover:text-burgundy transition-colors"
              >
                <FaReply /> Reply
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                className="flex items-center gap-1 text-sm text-ink/30 hover:text-red-500 transition-colors"
              >
                <FaTrash className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment._id && (
        <form onSubmit={handleReply} className="mt-4 ml-8">
          <div className="flex gap-3 items-start">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
              className="flex-1 px-4 py-2 bg-white/70 dark:bg-ink/10 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 resize-y text-ink placeholder:text-ink/40"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-burgundy text-white px-4 py-1 rounded-lg text-sm hover:bg-burgundy/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Reply"}
            </button>
            <button
              type="button"
              onClick={() => onReply(null)}
              className="border border-ink/20 text-ink px-4 py-1 rounded-lg text-sm hover:bg-ink/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-gold/20 pl-4">
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
              postAuthor={postAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function for reaction buttons
function getReactionButton(reaction, comment, onReact) {
  const config = {
    like: { Icon: FaThumbsUp, color: "text-blue-500" },
    love: { Icon: FaHeart, color: "text-red-500" },
    insightful: { Icon: FaLightbulb, color: "text-yellow-500" },
    question: { Icon: FaQuestionCircle, color: "text-purple-500" },
  };

  const { Icon, color } = config[reaction];
  const count = comment.reactions?.[reaction] || 0;

  return (
    <button
      onClick={() => onReact(comment._id, reaction)}
      className={`flex items-center gap-1 text-sm transition-colors ${
        count > 0 ? color : "text-ink/30 hover:text-ink/60"
      }`}
    >
      <Icon /> {count > 0 && count}
    </button>
  );
}

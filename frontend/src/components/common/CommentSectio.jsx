import React, { useState, useEffect } from "react";
import { FaUser, FaClock } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function CommentSection({ postId, postSlug }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
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

  if (loading)
    return <div className="text-center py-4">Loading comments...</div>;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-serif font-bold mb-6">
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
            className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 resize-y"
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
        <div className="bg-cream p-4 rounded-lg mb-8 text-center text-ink/60">
          <p>
            Please{" "}
            <a href="/login" className="text-burgundy hover:underline">
              login
            </a>{" "}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-ink/40 text-center py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-l-4 border-gold/30 pl-4 py-2"
            >
              <div className="flex items-center gap-2 text-sm text-ink/50">
                <FaUser className="text-xs" />
                <span className="font-serif font-semibold">
                  {comment.author?.username || "Anonymous"}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

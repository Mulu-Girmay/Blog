import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function PostManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts?limit=50");
      setPosts(res.data.posts);
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted");
      fetchPosts();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif">All Posts ({posts.length})</h2>
        <Link
          to="/admin/write"
          className="bg-burgundy text-white px-4 py-2 rounded-lg text-sm hover:bg-burgundy/90 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/20 text-left text-sm text-ink/50">
              <th className="pb-2 font-serif">Title</th>
              <th className="pb-2 font-serif hidden md:table-cell">Category</th>
              <th className="pb-2 font-serif hidden lg:table-cell">Date</th>
              <th className="pb-2 font-serif text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post._id}
                className="border-b border-gold/10 hover:bg-cream/50 transition-colors"
              >
                <td className="py-3 pr-4">
                  <div>
                    <div className="font-serif font-medium">{post.title}</div>
                    {post.featured && (
                      <span className="text-xs text-gold">⭐ Featured</span>
                    )}
                  </div>
                </td>
                <td className="py-3 hidden md:table-cell text-sm text-ink/60">
                  {post.category}
                </td>
                <td className="py-3 hidden lg:table-cell text-sm text-ink/40">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/post/${post.slug}`}
                      target="_blank"
                      className="p-2 text-ink/30 hover:text-ink/60 transition-colors"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      to={`/admin/edit/${post._id}`}
                      className="p-2 text-ink/30 hover:text-burgundy transition-colors"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id, post.title)}
                      className="p-2 text-ink/30 hover:text-red-500 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

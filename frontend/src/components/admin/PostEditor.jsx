import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaSave, FaTimes } from "react-icons/fa";

export default function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "General Legal Articles",
    tags: "",
    featured: false,
    plainEnglish: "",
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${id}`);
      const post = res.data;
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags?.join(", ") || "",
        featured: post.featured,
        plainEnglish: post.plainEnglish || "",
      });
    } catch (err) {
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value || "" }));
  };

  const handlePlainEnglishChange = (value) => {
    setFormData((prev) => ({ ...prev, plainEnglish: value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (id) {
        await api.put(`/posts/${id}`, payload);
        toast.success("Post updated! ✨");
      } else {
        await api.post("/posts", payload);
        toast.success("Post published! 🎉");
      }
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block font-serif font-semibold mb-2">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 text-lg"
          placeholder="Your article title..."
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block font-serif font-semibold mb-2">Excerpt *</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
          maxLength="200"
          rows="2"
          className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
          placeholder="A short summary (max 200 characters)..."
        />
        <p className="text-xs text-ink/40 mt-1">
          {formData.excerpt.length}/200
        </p>
      </div>

      {/* Main Content */}
      <div>
        <label className="block font-serif font-semibold mb-2">
          Content * (Markdown)
        </label>
        <div className="bg-white/70 rounded-lg overflow-hidden border border-gold/20">
          <MDEditor
            value={formData.content}
            onChange={handleContentChange}
            height={400}
            preview="edit"
          />
        </div>
      </div>

      {/* Plain English Version */}
      <div>
        <label className="block font-serif font-semibold mb-2">
          ✨ Plain English Version (Optional)
        </label>
        <p className="text-sm text-ink/60 mb-2">
          Simplify your article for non-lawyers. If filled, readers can toggle
          between versions.
        </p>
        <div className="bg-white/70 rounded-lg overflow-hidden border border-gold/20">
          <MDEditor
            value={formData.plainEnglish}
            onChange={handlePlainEnglishChange}
            height={200}
            preview="edit"
          />
        </div>
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-serif font-semibold mb-2">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
            placeholder="General Legal Articles"
          />
        </div>
        <div>
          <label className="block font-serif font-semibold mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
            placeholder="constitutional, rights, police"
          />
        </div>
      </div>

      {/* Featured toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          id="featured"
          className="w-4 h-4 accent-burgundy"
        />
        <label htmlFor="featured" className="font-serif">
          ⭐ Feature this article on homepage
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-gold/20">
        <button
          type="submit"
          disabled={saving}
          className="bg-burgundy text-white px-6 py-3 rounded-lg font-serif hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave />{" "}
          {saving ? "Saving..." : id ? "Update Post" : "Publish Post"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="border border-ink/20 px-6 py-3 rounded-lg font-serif hover:bg-ink/5 transition-colors flex items-center gap-2"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
}

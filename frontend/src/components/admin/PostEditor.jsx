import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import api from "../../services/api";
import toast from "react-hot-toast";
import { FaSave, FaTimes } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";

export default function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { darkMode } = useDarkMode();
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
        <label className="block font-serif font-semibold mb-2 text-ink">
          Title <span className="text-burgundy">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white/70 dark:bg-ink/10 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 text-ink"
          placeholder="Your article title..."
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block font-serif font-semibold mb-2 text-ink">
          Excerpt <span className="text-burgundy">*</span>
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
          maxLength="200"
          rows="2"
          className="w-full px-4 py-3 bg-white/70 dark:bg-ink/10 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 text-ink"
          placeholder="A short summary (max 200 characters)..."
        />
        <p className="text-xs text-ink/40 mt-1">
          {formData.excerpt.length}/200
        </p>
      </div>

      {/* Main Content - FIXED */}
      <div>
        <label className="block font-serif font-semibold mb-2 text-ink">
          Content <span className="text-burgundy">*</span> (Markdown)
        </label>
        <div className="border border-gold/20 rounded-lg overflow-hidden">
          <MDEditor
            value={formData.content}
            onChange={handleContentChange}
            height={400}
            preview="edit"
            className={!darkMode ? "light-mode-editor" : ""}
            style={{
              backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
              color: darkMode ? "#e8e8e8" : "#2C2C2C",
            }}
          />
        </div>
      </div>

      {/* Plain English Version - FIXED */}
      <div>
        <label className="block font-serif font-semibold mb-2 text-ink">
          ✨ Plain English Version (Optional)
        </label>
        <p className="text-sm text-ink/60 mb-2">
          Simplify your article for non-lawyers. If filled, readers can toggle
          between versions.
        </p>
        <div className="border border-gold/20 rounded-lg overflow-hidden">
          <MDEditor
            value={formData.plainEnglish}
            onChange={handlePlainEnglishChange}
            height={200}
            preview="edit"
            className={!darkMode ? "light-mode-editor" : ""}
            style={{
              backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
              color: darkMode ? "#e8e8e8" : "#2C2C2C",
            }}
          />
        </div>
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-serif font-semibold mb-2 text-ink">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/70 dark:bg-ink/10 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 text-ink"
            placeholder="General Legal Articles"
          />
        </div>
        <div>
          <label className="block font-serif font-semibold mb-2 text-ink">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/70 dark:bg-ink/10 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 text-ink"
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
        <label htmlFor="featured" className="font-serif text-ink">
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
          className="border border-ink/20 text-ink px-6 py-3 rounded-lg font-serif hover:bg-ink/5 transition-colors flex items-center gap-2"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
}

import React, { useState } from "react";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";

export default function AskPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    question: "",
    category: "General",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    "General Legal Question",
    "Criminal Law",
    "Family Law",
    "Property Law",
    "Civil Law",
    "Employment Law",
    "Consumer Rights",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/questions", formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        question: "",
        category: "General",
      });
      toast.success("Question submitted! I'll review it soon.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit question");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="magazine-card p-12 text-center">
          <div className="text-6xl mb-6">📬</div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Question Received!
          </h2>
          <p className="text-ink/70 text-lg mb-6">
            Thank you for your question. I'll review it and get back to you via
            email, or feature it in a future blog post.
          </p>
          <div className="bg-cream rounded-lg p-4 inline-block text-sm text-ink/60">
            💡 Your question may become a future article!
          </div>
          <div className="mt-8">
            <button
              onClick={() => setSubmitted(false)}
              className="bg-burgundy text-white px-8 py-3 rounded-full hover:bg-burgundy/90 transition-colors"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-5xl block mb-4">⚖️</span>
        <h1 className="text-4xl font-serif font-bold">Ask a Legal Question</h1>
        <p className="text-ink/60 mt-2 max-w-xl mx-auto">
          Have a legal question? Ask me! Your question might become the topic of
          my next article.
        </p>
      </div>

      {/* Form */}
      <div className="magazine-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Your Name <span className="text-burgundy">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Email Address <span className="text-burgundy">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
              placeholder="john@example.com"
            />
            <p className="text-xs text-ink/40 mt-1">
              I'll use this to follow up if needed. Your email stays private.
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Subject <span className="text-burgundy">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
              placeholder="Brief summary of your question"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Your Question <span className="text-burgundy">*</span>
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 resize-y"
              placeholder="Describe your legal question in detail..."
            />
            <p className="text-xs text-ink/40 mt-1">
              Be as specific as possible so I can provide the most helpful
              response.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-cream/50 border border-gold/20 rounded-lg p-4">
            <p className="text-xs text-ink/60">
              ⚖️ <strong>Disclaimer:</strong> This is for informational purposes
              only and does not constitute legal advice. Always consult a
              qualified attorney for your specific situation.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-3 rounded-lg font-serif hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <FaPaperPlane /> Submit Question
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info Box */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📝</div>
          <h4 className="font-serif font-semibold">Confidential</h4>
          <p className="text-xs text-ink/40">Your identity stays private</p>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📖</div>
          <h4 className="font-serif font-semibold">May Become an Article</h4>
          <p className="text-xs text-ink/40">Your question helps others too</p>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">💡</div>
          <h4 className="font-serif font-semibold">Free Resource</h4>
          <p className="text-xs text-ink/40">No charge for legal information</p>
        </div>
      </div>
    </div>
  );
}

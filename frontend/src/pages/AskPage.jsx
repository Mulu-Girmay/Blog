import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AskPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    question: "",
    category: "General Legal Question",
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
    "Constitutional Law",
    "Other",
  ];

  // Auto-fill for logged-in users
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/questions", formData);
      setSubmitted(true);
      toast.success("✅ Question submitted! You'll be notified when answered.");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit question");
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="magazine-card p-8 sm:p-12 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Please Login to Ask a Question
          </h2>
          <p className="text-ink/70 mb-6 max-w-md mx-auto">
            Create a free account to ask legal questions and get email
            notifications when answered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-burgundy text-white px-8 py-3 rounded-full hover:bg-burgundy/90 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="border-2 border-burgundy/30 text-ink px-8 py-3 rounded-full hover:bg-burgundy/5 transition-colors"
            >
              Create Account
            </Link>
          </div>
          <div className="mt-6 flex justify-center gap-8 text-sm text-ink/40">
            <span>✅ Free</span>
            <span>✅ 30 seconds</span>
            <span>✅ Email notifications</span>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="magazine-card p-8 sm:p-12 text-center">
          <div className="text-6xl mb-6">📬</div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Question Received!
          </h2>
          <p className="text-ink/70 text-lg mb-4">
            Thank you for your question, {formData.name}!
          </p>
          <div className="bg-cream rounded-lg p-4 inline-block text-sm text-ink/60">
            <p>📧 You'll receive an email when your question is answered.</p>
            <p className="mt-1">
              💡 Your question may also become a future article!
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSubmitted(false)}
              className="bg-burgundy text-white px-8 py-3 rounded-full hover:bg-burgundy/90 transition-colors"
            >
              Ask Another Question
            </button>
            <Link
              to="/profile"
              className="border-2 border-burgundy/30 text-ink px-8 py-3 rounded-full hover:bg-burgundy/5 transition-colors"
            >
              View My Questions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <span className="text-4xl md:text-5xl block mb-4">⚖️</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold">Ask a Legal Question</h1>
        <p className="text-ink/60 mt-2 max-w-xl mx-auto text-sm md:text-base">
          Have a legal question? Ask me! You'll get an email notification when
          answered.
        </p>
        {user && (
          <div className="mt-2 text-sm text-green-600">
            <FaCheckCircle className="inline mr-1" /> Logged in as{" "}
            {user.username}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="magazine-card p-5 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Your Name <span className="text-burgundy">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                readOnly={!!user}
                className={`w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 ${user ? "cursor-not-allowed text-ink/60" : ""}`}
                placeholder="John Doe"
              />
            </div>
            {user && (
              <p className="text-xs text-ink/40 mt-1">
                Using your account name
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-serif font-semibold mb-2">
              Email Address <span className="text-burgundy">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                readOnly={!!user}
                className={`w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 ${user ? "cursor-not-allowed text-ink/60" : ""}`}
                placeholder="john@example.com"
              />
            </div>
            <p className="text-xs text-ink/40 mt-1">
              {user
                ? "Using your account email"
                : "We'll send notifications here"}
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
            <div className="relative">
              <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
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
              Be specific so I can provide the most helpful response.
            </p>
          </div>

          {/* Notification Info */}
          <div className="bg-cream/50 border border-gold/20 rounded-lg p-4 flex items-start gap-3">
            <span className="text-xl">📧</span>
            <div>
              <p className="text-sm font-serif font-semibold">
                You'll get notified when answered!
              </p>
              <p className="text-xs text-ink/60">
                An email will be sent to{" "}
                <strong>{formData.email || "your email"}</strong> when your
                question is answered. You can manage notification preferences in
                your profile.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-700">
              ⚖️ <strong>Disclaimer:</strong> This is for informational purposes
              only and does not constitute legal advice. Always consult a
              qualified attorney for your specific situation.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-3.5 rounded-lg font-serif hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-base min-h-[52px]"
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
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="font-serif font-semibold">Confidential</h4>
          <p className="text-xs text-ink/40">Your identity stays private</p>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📖</div>
          <h4 className="font-serif font-semibold">May Become an Article</h4>
          <p className="text-xs text-ink/40">Your question helps others too</p>
        </div>
        <div className="text-center p-4">
          <div className="text-2xl mb-2">📧</div>
          <h4 className="font-serif font-semibold">Email Notification</h4>
          <p className="text-xs text-ink/40">Get notified when answered</p>
        </div>
      </div>
    </div>
  );
}

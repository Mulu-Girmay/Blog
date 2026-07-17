import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaQuestionCircle,
  FaCheckCircle,
  FaClock,
  FaPen,
  FaBell,
  FaSave,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    if (user) {
      fetchUserQuestions();
    }
  }, [user]);

  const fetchUserQuestions = async () => {
    try {
      const res = await api.get("/questions/user/my-questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  // Don't show profile for admin/author (they have admin dashboard)
  if (user.role === "admin" || user.role === "author") {
    return <Navigate to="/admin" />;
  }

  const answeredQuestions = questions.filter((q) => q.isAnswered);
  const unansweredQuestions = questions.filter((q) => !q.isAnswered);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Profile Header */}
      <div className="magazine-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-burgundy/10 flex items-center justify-center text-4xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-serif font-bold">{user.username}</h1>
            <p className="text-ink/60">{user.bio || "Legal Reader"}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-sm text-ink/50">
              <span className="flex items-center gap-1">
                <FaEnvelope className="text-xs" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <FaCalendar className="text-xs" /> Joined{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FaQuestionCircle className="text-xs" /> {questions.length}{" "}
                questions
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/ask"
              className="bg-burgundy text-white px-4 py-2 rounded-lg text-sm hover:bg-burgundy/90 transition-colors"
            >
              Ask Question
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
        <div className="magazine-card p-4 text-center">
          <div className="text-2xl font-serif font-bold text-burgundy">
            {questions.length}
          </div>
          <div className="text-sm text-ink/60">Total Questions</div>
        </div>
        <div className="magazine-card p-4 text-center">
          <div className="text-2xl font-serif font-bold text-green-600">
            {answeredQuestions.length}
          </div>
          <div className="text-sm text-ink/60">Answered</div>
        </div>
        <div className="magazine-card p-4 text-center">
          <div className="text-2xl font-serif font-bold text-amber-600">
            {unansweredQuestions.length}
          </div>
          <div className="text-sm text-ink/60">Pending</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gold/20 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 font-serif text-sm transition-colors whitespace-nowrap ${
            activeTab === "questions"
              ? "text-burgundy border-b-2 border-burgundy"
              : "text-ink/50 hover:text-ink/80"
          }`}
        >
          <FaQuestionCircle className="inline mr-2" /> My Questions
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-serif text-sm transition-colors whitespace-nowrap ${
            activeTab === "profile"
              ? "text-burgundy border-b-2 border-burgundy"
              : "text-ink/50 hover:text-ink/80"
          }`}
        >
          <FaUser className="inline mr-2" /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-serif text-sm transition-colors whitespace-nowrap ${
            activeTab === "notifications"
              ? "text-burgundy border-b-2 border-burgundy"
              : "text-ink/50 hover:text-ink/80"
          }`}
        >
          <FaBell className="inline mr-2" /> Notifications
        </button>
      </div>

      {/* Tab Content: Questions */}
      {activeTab === "questions" && (
        <div>
          {loadingQuestions ? (
            <div className="text-center py-8">Loading your questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-serif font-semibold mb-2">
                No Questions Yet
              </h3>
              <p className="text-ink/60">Ask your first legal question!</p>
              <Link
                to="/ask"
                className="inline-block mt-4 bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors"
              >
                Ask a Question
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q._id} className="magazine-card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-serif font-semibold">
                          {q.subject}
                        </h3>
                        {q.isAnswered ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                            <FaCheckCircle /> Answered
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs flex items-center gap-1">
                            <FaClock /> Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink/60 mt-1 line-clamp-2">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-ink/40">
                        <span>📂 {q.category}</span>
                        <span>
                          🕐{" "}
                          {formatDistanceToNow(new Date(q.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      {q.isAnswered && q.answer && (
                        <div className="mt-3 bg-cream p-3 rounded-lg">
                          <p className="text-sm font-serif font-semibold text-burgundy">
                            💡 Answer:
                          </p>
                          <p className="text-sm text-ink/70">{q.answer}</p>
                          {q.answeredBy && (
                            <p className="text-xs text-ink/40 mt-1">
                              Answered by: {q.answeredBy}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Edit Profile */}
      {activeTab === "profile" && <ProfileEditor user={user} />}

      {/* Tab Content: Notifications */}
      {activeTab === "notifications" && <NotificationSettings user={user} />}
    </div>
  );
}

// Profile Editor Component
function ProfileEditor({ user }) {
  const [formData, setFormData] = useState({
    bio: user.bio || "",
    email: user.email || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/profile", formData);
      toast.success("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-serif mb-1">Username</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="w-full px-4 py-2 bg-ink/5 border border-gold/20 rounded-lg cursor-not-allowed text-ink/50"
          />
          <p className="text-xs text-ink/40 mt-1">Username cannot be changed</p>
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
          />
        </div>
        <div>
          <label className="block text-sm font-serif mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 resize-y"
            placeholder="Tell us about yourself..."
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave /> {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
}

// Notification Settings Component
function NotificationSettings({ user }) {
  const [notifications, setNotifications] = useState({
    newPost: user?.notifications?.newPost !== false,
    questionAnswered: user?.notifications?.questionAnswered !== false,
    newsletter: user?.notifications?.newsletter !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/profile", { notifications });
      toast.success("Notification settings updated!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-cream p-4 rounded-lg mb-4">
          <p className="text-sm text-ink/60">
            📧 Choose which emails you'd like to receive from us.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border border-gold/20 rounded-lg hover:bg-cream/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.newPost}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  newPost: e.target.checked,
                })
              }
              className="w-5 h-5 accent-burgundy mt-0.5 flex-shrink-0"
            />
            <div>
              <div className="font-serif font-semibold text-sm">
                New Articles & Posts
              </div>
              <div className="text-xs text-ink/40">
                Get notified when I publish new legal articles
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-gold/20 rounded-lg hover:bg-cream/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.questionAnswered}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  questionAnswered: e.target.checked,
                })
              }
              className="w-5 h-5 accent-burgundy mt-0.5 flex-shrink-0"
            />
            <div>
              <div className="font-serif font-semibold text-sm">
                Question Answered
              </div>
              <div className="text-xs text-ink/40">
                Get notified when your legal questions are answered
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-gold/20 rounded-lg hover:bg-cream/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={notifications.newsletter}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  newsletter: e.target.checked,
                })
              }
              className="w-5 h-5 accent-burgundy mt-0.5 flex-shrink-0"
            />
            <div>
              <div className="font-serif font-semibold text-sm">
                Weekly Newsletter
              </div>
              <div className="text-xs text-ink/40">
                Weekly summary of all new articles (coming soon)
              </div>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <FaSave /> {saving ? "Saving..." : "Save Notification Settings"}
        </button>

        <p className="text-xs text-ink/40 mt-2">
          You can change these settings anytime. We'll never spam you. 🔒
        </p>
      </form>
    </div>
  );
}

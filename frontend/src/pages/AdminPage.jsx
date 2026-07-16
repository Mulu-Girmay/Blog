import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import PostEditor from "../components/admin/PostEditor";
import PostManager from "../components/admin/PostManager";
import UserManager from "../components/admin/UserManager";
import QuestionManager from "../components/admin/QuestionManager";
import {
  FaEdit,
  FaList,
  FaUsers,
  FaKey,
  FaQuestionCircle,
  FaHome,
  FaFileAlt,
  FaComments,
  FaBell,
  FaChartBar,
  FaPlus,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalQuestions: 0,
    totalUsers: 0,
    pendingQuestions: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Determine active tab from URL
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("/write")) return "write";
    if (path.includes("/edit")) return "write";
    if (path.includes("/users")) return "users";
    if (path.includes("/questions")) return "questions";
    if (path.includes("/password")) return "password";
    if (path.includes("/manage")) return "manage";
    return "dashboard";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome />, path: "/admin" },
    { id: "write", label: "Write New", icon: <FaPlus />, path: "/admin/write" },
    {
      id: "manage",
      label: "Manage Posts",
      icon: <FaList />,
      path: "/admin/manage",
    },
    {
      id: "questions",
      label: "Questions",
      icon: <FaQuestionCircle />,
      path: "/admin/questions",
    },
  ];

  const isAdmin = user?.role === "admin";

  if (isAdmin) {
    navItems.push({
      id: "users",
      label: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
    });
  }

  navItems.push({
    id: "password",
    label: "Security",
    icon: <FaKey />,
    path: "/admin/password",
  });

  // ✅ FIXED: Fetch REAL stats from database
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      // 1️⃣ Fetch ALL posts to get real count
      const postsRes = await api.get("/posts?limit=100");
      const allPosts = postsRes.data.posts || [];
      const totalPosts = allPosts.length;

      // 2️⃣ Fetch ALL questions to get real count
      const questionsRes = await api.get("/questions");
      const questions = questionsRes.data || [];
      const totalQuestions = questions.length;
      const pendingQuestions = questions.filter((q) => !q.isAnswered).length;

      // 3️⃣ Fetch users count (only if admin)
      let totalUsers = 1; // Default: current user
      if (isAdmin) {
        try {
          const usersRes = await api.get("/users");
          totalUsers = usersRes.data.length || 1;
        } catch (err) {
          console.error("Failed to fetch users:", err);
          totalUsers = 1;
        }
      }

      // 4️⃣ Update stats with real data
      setStats({
        totalPosts,
        totalQuestions,
        totalUsers,
        pendingQuestions,
      });

      console.log("✅ Real Stats fetched:", {
        totalPosts,
        totalQuestions,
        totalUsers,
        pendingQuestions,
      });
    } catch (err) {
      console.error("❌ Failed to fetch stats:", err);
      // Keep existing stats
    } finally {
      setLoadingStats(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Redirect to dashboard after password change
      handleTabChange("dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle tab change with URL update
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const path = navItems.find((item) => item.id === tabId)?.path || "/admin";
    window.history.pushState({}, "", path);
  };

  // Handle browser back button - always go to dashboard
  useEffect(() => {
    const handlePopState = () => {
      if (activeTab !== "dashboard") {
        handleTabChange("dashboard");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeTab]);

  // Refresh stats when user returns to dashboard
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchStats();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-paper">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold/20 border-t-burgundy rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-ink/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  // Redirect guests
  if (user.role !== "admin" && user.role !== "author") {
    toast.error("You do not have permission to access the admin panel.");
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50
        w-64 h-screen bg-cream border-r border-gold/20
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200
                ${
                  activeTab === item.id
                    ? "bg-burgundy text-white shadow-lg shadow-burgundy/20"
                    : "text-ink/60 hover:bg-burgundy/5 hover:text-ink"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {item.id === "questions" && stats.pendingQuestions > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingQuestions}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gold/20">
          <button
            onClick={() => {
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="bg-cream/80 backdrop-blur-sm border-b border-gold/20 sticky top-0 z-30 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-burgundy/5 transition-colors lg:hidden"
              >
                <FaBars />
              </button>
              <div>
                <h1 className="font-serif text-xl font-bold">
                  {navItems.find((i) => i.id === activeTab)?.label ||
                    "Dashboard"}
                </h1>
                <p className="text-xs text-ink/40">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.username === "admin" && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                  ⚠️ Change default password
                </span>
              )}
              <Link
                to="/"
                className="text-ink/40 hover:text-burgundy transition-colors text-sm flex items-center gap-1"
              >
                <FaHome /> View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={<FaFileAlt />}
                  label="Total Posts"
                  value={stats.totalPosts}
                  color="burgundy"
                />
                <StatCard
                  icon={<FaQuestionCircle />}
                  label="Questions"
                  value={stats.totalQuestions}
                  color="gold"
                />
                <StatCard
                  icon={<FaComments />}
                  label="Pending"
                  value={stats.pendingQuestions}
                  color="amber"
                />
                <StatCard
                  icon={<FaUsers />}
                  label="Users"
                  value={stats.totalUsers}
                  color="navy"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="magazine-card p-6">
                  <h3 className="font-serif text-lg font-bold mb-4">
                    ✍️ Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleTabChange("write")}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-burgundy/5 transition-colors group w-full text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center group-hover:bg-burgundy/20 transition-colors flex-shrink-0">
                        <FaPlus className="text-burgundy" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold">
                          Write New Post
                        </p>
                        <p className="text-xs text-ink/40">
                          Create a new legal article
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleTabChange("questions")}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-burgundy/5 transition-colors group w-full text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors flex-shrink-0">
                        <FaQuestionCircle className="text-gold" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold">
                          View Questions
                        </p>
                        <p className="text-xs text-ink/40">
                          {stats.pendingQuestions} pending questions
                        </p>
                      </div>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleTabChange("users")}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-burgundy/5 transition-colors group w-full text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center group-hover:bg-navy/20 transition-colors flex-shrink-0">
                          <FaUsers className="text-navy" />
                        </div>
                        <div>
                          <p className="font-serif font-semibold">
                            Manage Users
                          </p>
                          <p className="text-xs text-ink/40">
                            {stats.totalUsers} registered users
                          </p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className="magazine-card p-6">
                  <h3 className="font-serif text-lg font-bold mb-4">
                    📊 Recent Activity
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 border-b border-gold/10">
                      <span className="text-ink/60">Total posts published</span>
                      <span className="font-serif font-bold">
                        {stats.totalPosts}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-gold/10">
                      <span className="text-ink/60">Total questions asked</span>
                      <span className="font-serif font-bold">
                        {stats.totalQuestions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 border-b border-gold/10">
                      <span className="text-ink/60">Answered questions</span>
                      <span className="font-serif font-bold text-green-600">
                        {stats.totalQuestions - stats.pendingQuestions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <span className="text-ink/60">Pending questions</span>
                      <span className="font-serif font-bold text-amber-600">
                        {stats.pendingQuestions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Write Tab */}
          {activeTab === "write" && <PostEditor />}

          {/* Manage Posts Tab */}
          {activeTab === "manage" && <PostManager />}

          {/* Users Tab */}
          {activeTab === "users" && isAdmin && <UserManager />}

          {/* Questions Tab */}
          {activeTab === "questions" && <QuestionManager />}

          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="max-w-md">
              <div className="magazine-card p-6">
                <h2 className="text-xl font-serif font-bold mb-4">
                  🔑 Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-serif mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-serif mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      minLength={6}
                      className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                    />
                    <p className="text-xs text-ink/40 mt-1">
                      Minimum 6 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-serif mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors disabled:opacity-50"
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    burgundy: "bg-burgundy/10 text-burgundy",
    gold: "bg-gold/10 text-gold",
    amber: "bg-amber/10 text-amber-600",
    navy: "bg-navy/10 text-navy",
  };

  return (
    <div className="magazine-card p-4 text-center">
      <div
        className={`w-10 h-10 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto text-xl`}
      >
        {icon}
      </div>
      <div className="text-2xl font-serif font-bold mt-2">{value}</div>
      <div className="text-xs text-ink/40">{label}</div>
    </div>
  );
}

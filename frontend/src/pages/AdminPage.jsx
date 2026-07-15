import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PostEditor from "../components/admin/PostEditor";
import PostManager from "../components/admin/PostManager";
import UserManager from "../components/admin/UserManager";
import { FaEdit, FaList, FaUsers, FaKey } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("manage");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin" && user.role !== "author") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif">Access Denied</h2>
        <p className="text-ink/60">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

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
      // Add this endpoint to your backend
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
      setShowPasswordChange(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const tabs = [
    { id: "manage", label: "Manage Posts", icon: <FaList /> },
    { id: "write", label: "Write New", icon: <FaEdit /> },
  ];

  if (user.role === "admin") {
    tabs.push({ id: "users", label: "User Management", icon: <FaUsers /> });
  }

  // Add password change tab for all users
  tabs.push({ id: "password", label: "Change Password", icon: <FaKey /> });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold">📝 Admin Dashboard</h1>
          <p className="text-ink/60">
            Welcome back, {user.username}!{user.role === "admin" && " (Admin)"}
            {user.role === "author" && " (Author)"}
          </p>
        </div>
        {/* Show warning for default password */}
        {user.username === "admin" && (
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg text-sm text-amber-800">
            ⚠️ Please change your default password
          </div>
        )}
      </div>

      <div className="flex space-x-4 border-b border-gold/20 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-serif text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-burgundy border-b-2 border-burgundy"
                : "text-ink/50 hover:text-ink/80"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "manage" && <PostManager />}
        {activeTab === "write" && <PostEditor />}
        {activeTab === "users" && user.role === "admin" && <UserManager />}
        {activeTab === "password" && (
          <div className="max-w-md">
            <h2 className="text-xl font-serif mb-4">🔑 Change Password</h2>
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
                <p className="text-xs text-ink/40 mt-1">Minimum 6 characters</p>
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
        )}
      </div>
    </div>
  );
}

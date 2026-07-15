import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PostEditor from "../components/admin/PostEditor";
import PostManager from "../components/admin/PostManager";
import UserManager from "../components/admin/UserManager";
import { FaEdit, FaList, FaUsers } from "react-icons/fa";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("manage");

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

  const tabs = [
    { id: "manage", label: "Manage Posts", icon: <FaList /> },
    { id: "write", label: "Write New", icon: <FaEdit /> },
  ];

  // Only show user management for admins
  if (user.role === "admin") {
    tabs.push({ id: "users", label: "User Management", icon: <FaUsers /> });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">📝 Admin Dashboard</h1>
        <p className="text-ink/60">
          Welcome back, {user.username}! {user.role === "admin" && "(Admin)"}
        </p>
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
      </div>
    </div>
  );
}

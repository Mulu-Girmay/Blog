import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PostEditor from "../components/admin/PostEditor";
import PostManager from "../components/admin/PostManager";
import { FaEdit, FaList } from "react-icons/fa";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">📝 Admin Dashboard</h1>
        <p className="text-ink/60">Welcome back, {user.username}!</p>
      </div>

      <div className="flex space-x-4 border-b border-gold/20 mb-6">
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-4 py-2 font-serif text-sm transition-colors ${
            activeTab === "manage"
              ? "text-burgundy border-b-2 border-burgundy"
              : "text-ink/50 hover:text-ink/80"
          }`}
        >
          <FaList className="inline mr-2" /> Manage Posts
        </button>
        <button
          onClick={() => setActiveTab("write")}
          className={`px-4 py-2 font-serif text-sm transition-colors ${
            activeTab === "write"
              ? "text-burgundy border-b-2 border-burgundy"
              : "text-ink/50 hover:text-ink/80"
          }`}
        >
          <FaEdit className="inline mr-2" /> Write New
        </button>
      </div>

      <div>
        {activeTab === "manage" && <PostManager />}
        {activeTab === "write" && <PostEditor />}
      </div>
    </div>
  );
}

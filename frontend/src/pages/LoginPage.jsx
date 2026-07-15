import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.username, formData.password);
    setLoading(false);
    if (result.success) {
      navigate("/admin");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="magazine-card p-8">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">⚖️</span>
          <h1 className="text-2xl font-serif font-bold">Welcome Back</h1>
          <p className="text-sm text-ink/60">Sign in to manage your articles</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-serif mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-serif mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-3 rounded-lg font-serif hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="divider-ampersand my-6">&amp;</div>
        <p className="text-center text-xs text-ink/40">
          Demo credentials: username: <strong>admin</strong> | password:{" "}
          <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}

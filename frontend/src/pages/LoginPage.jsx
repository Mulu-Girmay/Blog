import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaArrowRight, FaUserPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../services/api";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      // ✅ PUBLIC REGISTRATION - ALWAYS CREATES GUEST
      try {
        // ✅ IMPORTANT: We DON'T send role - backend defaults to 'guest'
        const res = await api.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          bio: formData.bio || "Reader",
          // ❌ NO role field - backend will set as 'guest'
        });

        // Auto-login after registration
        const loginResult = await login(formData.username, formData.password);
        if (loginResult.success) {
          // ✅ Check if user is guest and redirect appropriately
          if (loginResult.user?.role === "guest") {
            toast.success("Welcome! You can now read and comment on articles.");
            navigate("/"); // Send to homepage, NOT admin
          } else {
            navigate("/admin");
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Registration failed");
      }
    } else {
      // Login
      const result = await login(formData.username, formData.password);
      if (result.success) {
        // ✅ Redirect based on role
        if (result.user?.role === "guest") {
          navigate("/"); // Guests go to homepage
        } else {
          navigate("/admin"); // Admin/Author go to dashboard
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="magazine-card p-8">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">⚖️</span>
          <h1 className="text-2xl font-serif font-bold">
            {isRegister ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-ink/60">
            {isRegister
              ? "Join as a reader and stay informed"
              : "Sign in to access your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-serif mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                placeholder="Choose a username"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-serif mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-serif mb-1">
                  Bio (optional)
                </label>
                <input
                  type="text"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                  placeholder="Tell us about yourself"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-serif mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
                placeholder={
                  isRegister ? "Min 6 characters" : "Enter your password"
                }
              />
            </div>
          </div>

          {/* ✅ Show role info for guests */}
          {isRegister && (
            <div className="text-xs text-ink/40 bg-cream p-3 rounded-lg">
              <p>
                📝 By registering, you'll have a <strong>guest</strong> account
                with read-only access.
              </p>
              <p className="mt-1">
                Authors and admins are created by the website administrator.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-3 rounded-lg font-serif hover:bg-burgundy/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                {isRegister ? "Create Account" : "Sign In"} <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="divider-ampersand my-6">&amp;</div>

        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setFormData({ username: "", email: "", password: "", bio: "" });
          }}
          className="w-full text-center text-sm text-ink/50 hover:text-burgundy transition-colors"
        >
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span className="font-serif text-burgundy">Sign In</span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span className="font-serif text-burgundy">Register Now</span>
            </>
          )}
        </button>

        {!isRegister && (
          <p className="text-center text-xs text-ink/40 mt-4">
            Demo: username: <strong>admin</strong> | password:{" "}
            <strong>admin123</strong>
          </p>
        )}
      </div>
    </div>
  );
}

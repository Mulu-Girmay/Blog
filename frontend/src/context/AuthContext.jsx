import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      // ✅ Custom welcome message based on role
      if (user.role === "guest") {
        toast.success(`Welcome ${user.username}! 📖`);
      } else if (user.role === "author") {
        toast.success(`Welcome back, ${user.username}! ✍️`);
      } else {
        toast.success(`Welcome back, ${user.username}! ⚖️`);
      }

      return { success: true, user };
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Logged out");
  };

  const isAdmin = user?.role === "admin";
  const isAuthor = user?.role === "author" || user?.role === "admin";
  const isGuest = user?.role === "guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isAuthor,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

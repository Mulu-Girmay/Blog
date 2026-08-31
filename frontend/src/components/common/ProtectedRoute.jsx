import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Wraps routes that require authentication.
 * - Shows a spinner while the auth state is resolving.
 * - Redirects unauthenticated users to /login.
 * - Redirects logged-in guests (no admin/author role) to home.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;

    if (!allowed) return <Navigate to="/" replace />;
  }

  return children;
}

import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import AskPage from "./pages/AskPage";
import AboutPage from "./pages/AboutPage";
import ArticlesPage from "./pages/ArticlesPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/write" element={<AdminPage />} />
          <Route path="/admin/edit/:id" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#FDF6E3",
            color: "#2C2C2C",
            border: "1px solid rgba(139,58,58,0.1)",
          },
          dark: {
            style: {
              background: "#1a1a1a",
              color: "#e8e8e8",
              border: "1px solid rgba(160,82,82,0.2)",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;

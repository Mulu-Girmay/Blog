import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
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
        }}
      />
    </AuthProvider>
  );
}

export default App;

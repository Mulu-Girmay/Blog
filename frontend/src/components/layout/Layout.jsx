import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      {!isAdminPage && <Header />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

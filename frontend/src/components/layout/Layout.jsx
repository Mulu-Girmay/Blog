import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

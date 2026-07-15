import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaSearch,
  FaUser,
  FaBookmark,
  FaMoon,
  FaSun,
  FaPen,
} from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  return (
    <header className="border-b border-gold/20 bg-cream/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-serif font-bold text-burgundy">
              ⚖️
            </span>
            <div>
              <h1 className="text-2xl font-serif font-bold text-ink leading-tight">
                Your Name, <span className="text-burgundy">Esq.</span>
              </h1>
              <p className="text-xs text-ink/60 font-sans tracking-wider italic">
                Legal clarity in a complex world
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 font-serif">
            <Link
              to="/"
              className="text-ink/80 hover:text-burgundy transition-colors"
            >
              Articles
            </Link>
            <Link
              to="/about"
              className="text-ink/80 hover:text-burgundy transition-colors"
            >
              About
            </Link>
            {user && (
              <Link
                to="/admin"
                className="text-burgundy hover:text-burgundy/80 transition-colors"
              >
                <FaPen className="inline mr-1" /> Write
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center"
            >
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/50 border border-gold/20 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-burgundy/50 transition-colors"
              />
              <button
                type="submit"
                className="ml-2 text-ink/60 hover:text-burgundy"
              >
                <FaSearch />
              </button>
            </form>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-ink/60 hover:text-burgundy transition-colors"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-ink/80 hidden md:inline">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-ink/60 hover:text-burgundy transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-burgundy text-white px-4 py-2 rounded-full text-sm hover:bg-burgundy/90 transition-colors"
              >
                <FaUser className="inline mr-1" /> Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden mt-3 space-x-6 text-sm">
          <Link to="/" className="text-ink/80 hover:text-burgundy">
            Articles
          </Link>
          <Link to="/about" className="text-ink/80 hover:text-burgundy">
            About
          </Link>
          {user && (
            <Link to="/admin" className="text-burgundy">
              Write
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

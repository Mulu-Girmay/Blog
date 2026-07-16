import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDarkMode } from "../../context/DarkModeContext";
import {
  FaSearch,
  FaUser,
  FaMoon,
  FaSun,
  FaPen,
  FaQuestionCircle,
  FaUserCircle,
  FaBookmark,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ✅ FIXED: Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/articles?search=${encodeURIComponent(query)}`);
      setSearchQuery(""); // Clear after search
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <header className="border-b border-gold/20 bg-cream/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-3xl font-serif font-bold text-burgundy">
              ⚖️
            </span>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-serif font-bold text-ink leading-tight">
                Kalayus <span className="text-burgundy">Blog</span>
              </h1>
              <p className="text-[10px] md:text-xs text-ink/60 font-sans tracking-wider italic hidden xs:block">
                Legal clarity in a complex world
              </p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 font-serif">
            <Link
              to="/"
              className="text-ink/80 hover:text-burgundy transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              to="/articles"
              className="text-ink/80 hover:text-burgundy transition-colors text-sm"
            >
              Articles
            </Link>
            <Link
              to="/ask"
              className="text-ink/80 hover:text-burgundy transition-colors text-sm flex items-center gap-1"
            >
              <FaQuestionCircle /> Ask
            </Link>
            <Link
              to="/about"
              className="text-ink/80 hover:text-burgundy transition-colors text-sm"
            >
              About
            </Link>
            {user && (user.role === "admin" || user.role === "author") && (
              <Link
                to="/admin"
                className="text-burgundy hover:text-burgundy/80 transition-colors text-sm"
              >
                <FaPen className="inline mr-1" /> Write
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* ✅ FIXED: Search form */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/50 dark:bg-ink/10 border border-gold/20 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:border-burgundy/50 transition-colors w-32 lg:w-48 text-ink placeholder:text-ink/40"
              />
              <button
                type="submit"
                className="ml-2 text-ink/60 hover:text-burgundy transition-colors"
              >
                <FaSearch />
              </button>
            </form>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-ink/60 hover:text-burgundy transition-colors p-2 rounded-full hover:bg-burgundy/10"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="text-gold" /> : <FaMoon />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-ink/80 hover:text-burgundy transition-colors"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:inline text-sm">
                    {user.username}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-cream dark:bg-ink/10 border border-gold/20 rounded-lg shadow-magazine py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink/80 hover:bg-burgundy/5 transition-colors"
                    >
                      <FaUserCircle /> My Profile
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink/80 hover:bg-burgundy/5 transition-colors"
                    >
                      <FaBookmark /> Saved Articles
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-burgundy hover:bg-burgundy/5 transition-colors"
                      >
                        <FaPen /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="border-gold/20 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-burgundy text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm hover:bg-burgundy/90 transition-colors flex items-center gap-1"
              >
                <FaUser className="text-xs" />{" "}
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="flex lg:hidden mt-3 space-x-4 text-sm overflow-x-auto pb-1">
          <Link
            to="/"
            className="text-ink/80 hover:text-burgundy whitespace-nowrap"
          >
            Home
          </Link>
          <Link
            to="/articles"
            className="text-ink/80 hover:text-burgundy whitespace-nowrap"
          >
            Articles
          </Link>
          <Link
            to="/ask"
            className="text-ink/80 hover:text-burgundy whitespace-nowrap flex items-center gap-1"
          >
            <FaQuestionCircle className="text-xs" /> Ask
          </Link>
          <Link
            to="/about"
            className="text-ink/80 hover:text-burgundy whitespace-nowrap"
          >
            About
          </Link>
          {user && (user.role === "admin" || user.role === "author") && (
            <Link
              to="/admin"
              className="text-burgundy hover:text-burgundy/80 whitespace-nowrap"
            >
              <FaPen className="inline mr-1" /> Write
            </Link>
          )}
          {/* ✅ FIXED: Mobile search */}
          <form onSubmit={handleSearch} className="flex items-center ml-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/50 dark:bg-ink/10 border border-gold/20 rounded-full px-2 py-0.5 text-sm w-24 focus:outline-none focus:border-burgundy/50 text-ink placeholder:text-ink/40"
            />
            <button
              type="submit"
              className="ml-1 text-ink/60 hover:text-burgundy"
            >
              <FaSearch className="text-xs" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

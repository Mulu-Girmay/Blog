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
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-3xl font-serif font-bold text-burgundy">
              ⚖️
            </span>
            <div className="hidden sm:block">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-ink leading-tight">
                Kalayus <span className="text-burgundy">Blog</span>
              </h1>
              <p className="text-sm md:text-base text-ink/60 font-sans tracking-wider italic hidden sm:block">
                Legal clarity in a complex world
              </p>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6 font-serif">
            <Link
              to="/"
              className="text-ink/80 hover:text-burgundy transition-colors text-base lg:text-lg"
            >
              Home
            </Link>
            <Link
              to="/articles"
              className="text-ink/80 hover:text-burgundy transition-colors text-base lg:text-lg"
            >
              Articles
            </Link>
            <Link
              to="/ask"
              className="text-ink/80 hover:text-burgundy transition-colors text-base lg:text-lg flex items-center gap-1"
            >
              <FaQuestionCircle /> Ask
            </Link>
            <Link
              to="/about"
              className="text-ink/80 hover:text-burgundy transition-colors text-base lg:text-lg"
            >
              About
            </Link>
            {user && (user.role === "admin" || user.role === "author") && (
              <Link
                to="/admin"
                className="text-burgundy hover:text-burgundy/80 transition-colors text-base lg:text-lg"
              >
                <FaPen className="inline mr-1" /> Write
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 md:space-x-3">
            {/* Hamburger - all sizes below lg */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink/60 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/10"
              aria-label="Menu"
            >
              {showMobileMenu ? <FaTimes /> : <FaBars />}
            </button>
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-ink/60 hover:text-burgundy transition-colors rounded-full hover:bg-burgundy/10"
              aria-label="Search"
            >
              <FaSearch />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="text-ink/60 hover:text-burgundy transition-colors p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-burgundy/10"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="text-gold" /> : <FaMoon />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-ink/80 hover:text-burgundy transition-colors min-h-[44px] px-1"
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

        {/* Mobile search bar */}
        {showMobileSearch && (
          <form onSubmit={handleSearch} className="lg:hidden mt-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                autoFocus
                className="w-full px-4 py-2.5 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-burgundy">
                <FaSearch className="text-sm" />
              </button>
            </div>
          </form>
        )}

        {/* Hamburger dropdown menu - all sizes below lg */}
        {showMobileMenu && (
          <div className="lg:hidden mt-2 border-t border-gold/20 pt-2 flex flex-col">
            <Link onClick={() => setShowMobileMenu(false)} to="/" className="px-4 py-3 text-lg text-ink/80 hover:text-burgundy hover:bg-burgundy/5 transition-colors">
              Home
            </Link>
            <Link onClick={() => setShowMobileMenu(false)} to="/articles" className="px-4 py-3 text-lg text-ink/80 hover:text-burgundy hover:bg-burgundy/5 transition-colors">
              Articles
            </Link>
            <Link onClick={() => setShowMobileMenu(false)} to="/ask" className="px-4 py-3 text-lg text-ink/80 hover:text-burgundy hover:bg-burgundy/5 transition-colors flex items-center gap-2">
              <FaQuestionCircle className="text-base" /> Ask
            </Link>
            <Link onClick={() => setShowMobileMenu(false)} to="/about" className="px-4 py-3 text-lg text-ink/80 hover:text-burgundy hover:bg-burgundy/5 transition-colors">
              About
            </Link>
            {user && (user.role === "admin" || user.role === "author") && (
              <Link onClick={() => setShowMobileMenu(false)} to="/admin" className="px-4 py-3 text-lg text-burgundy hover:bg-burgundy/5 transition-colors flex items-center gap-2">
                <FaPen className="text-base" /> Write
              </Link>
            )}
          </div>
        )}


      </div>
    </header>
  );
}

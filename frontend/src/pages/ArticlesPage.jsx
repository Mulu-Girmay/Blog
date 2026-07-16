import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaClock,
  FaTag,
  FaUser,
  FaArrowRight,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import api from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export default function ArticlesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryFilter = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [categoryFilter, searchParam, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", postsPerPage);
      params.append("page", currentPage);
      if (categoryFilter) params.append("category", categoryFilter);
      if (searchParam) params.append("search", searchParam);

      const res = await api.get(`/posts?${params.toString()}`);
      setPosts(res.data.posts);
      setTotalPosts(res.data.total);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/posts");
      const allPosts = res.data.posts || [];
      const uniqueCategories = [
        ...new Set(allPosts.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === categoryFilter) {
      setSearchParams({});
    } else {
      setSearchParams({ category, page: 1 });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim(), page: 1 });
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header - Legal Archive Style */}
      <div className="border-b-2 border-gold/30 pb-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight">
              ARCHIVE <span className="text-burgundy">SELECTION</span>
            </h1>
            <p className="text-ink/60 mt-2 max-w-2xl text-sm leading-relaxed">
              Clear, practical legal analysis for everyday people. Our articles
              break down complex legal topics into actionable insights on
              constitutional, civil, and commercial law.
            </p>
          </div>
          <div className="text-sm text-ink/40 font-mono tracking-wider">
            {totalPosts} {totalPosts === 1 ? "CASE" : "CASES"}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases by title, topic, or keyword..."
              className="w-full px-4 py-2.5 bg-white/50 dark:bg-ink/5 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-2 focus:ring-burgundy/10 transition-all text-ink placeholder:text-ink/40"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink/40 hover:text-burgundy transition-colors"
            >
              <FaSearch />
            </button>
          </div>
          {searchParam && (
            <button
              onClick={() => setSearchParams({})}
              className="px-3 py-2 text-sm text-ink/40 hover:text-burgundy transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Search Results Info */}
      {searchParam && (
        <div className="mb-4 text-sm text-ink/50">
          Showing results for:{" "}
          <span className="font-serif font-semibold text-ink">
            "{searchParam}"
          </span>
          <span className="ml-2">•</span>
          <span className="ml-2">
            {totalPosts} {totalPosts === 1 ? "result" : "results"}
          </span>
        </div>
      )}

      {/* Filter Bar - Legal Style */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-gold/10 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setSearchParams({})}
              className={`px-3 py-1 text-xs transition-colors ${
                !categoryFilter && !searchParam
                  ? "text-burgundy font-serif font-semibold border-b-2 border-burgundy"
                  : "text-ink/50 hover:text-ink/80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1 text-xs transition-colors ${
                  categoryFilter === cat
                    ? "text-burgundy font-serif font-semibold border-b-2 border-burgundy"
                    : "text-ink/50 hover:text-ink/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink/40">
          <span>Sort by:</span>
          <select className="bg-transparent border-none text-ink/60 focus:outline-none font-serif">
            <option>Most Recent</option>
            <option>Oldest</option>
            <option>Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Articles Grid - Legal Archive Style */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-serif font-semibold text-ink">
            No cases found
          </h3>
          <p className="text-ink/60">
            {searchParam
              ? `No results found for "${searchParam}"`
              : "No articles published yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <ArticleCard key={post._id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* Pagination - Legal Style */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 pt-6 border-t border-gold/10">
          <button
            onClick={() =>
              setSearchParams({
                page: currentPage - 1,
                ...(categoryFilter && { category: categoryFilter }),
                ...(searchParam && { search: searchParam }),
              })
            }
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border border-gold/20 rounded hover:bg-burgundy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-ink"
          >
            Previous
          </button>
          <span className="text-sm text-ink/40 font-mono">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setSearchParams({
                page: currentPage + 1,
                ...(categoryFilter && { category: categoryFilter }),
                ...(searchParam && { search: searchParam }),
              })
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border border-gold/20 rounded hover:bg-burgundy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-ink"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Article Card Component - Legal Archive Style
function ArticleCard({ post, index }) {
  const categoryColors = {
    "General Legal Articles": "bg-burgundy/10 text-burgundy",
    "Constitutional Law":
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Criminal Law":
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Family Law":
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "Property Law":
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Civil Law":
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Employment Law":
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Consumer Rights":
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  };

  const defaultColor = "bg-ink/5 text-ink/60";
  const categoryColor = categoryColors[post.category] || defaultColor;

  return (
    <article className="group border-b border-gold/10 pb-6 hover:border-burgundy/20 transition-colors">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left - Category Badge & Number */}
        <div className="md:w-32 flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-2">
          <span
            className={`px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded ${categoryColor}`}
          >
            {post.category || "General"}
          </span>
          <span className="text-xs font-mono text-ink/20 group-hover:text-ink/40 transition-colors">
            #{String(index + 1).padStart(3, "0")}
          </span>
        </div>

        {/* Center - Content */}
        <div className="flex-1 min-w-0">
          <Link to={`/post/${post.slug}`}>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-ink group-hover:text-burgundy transition-colors leading-tight">
              {post.title}
            </h2>
          </Link>
          <p className="text-sm text-ink/60 mt-2 leading-relaxed max-w-2xl">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-ink/40">
            <span className="flex items-center gap-1">
              <FaUser className="text-[10px]" />{" "}
              {post.author?.name || "Kalayus Blog"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FaClock className="text-[10px]" /> {post.readTime || 3} min read
            </span>
            <span>•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Right - Read More */}
        <div className="md:w-24 flex-shrink-0 flex items-center md:items-start justify-end">
          <Link
            to={`/post/${post.slug}`}
            className="text-xs font-mono tracking-wider text-burgundy hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            READ <span className="hidden sm:inline">MORE</span>{" "}
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

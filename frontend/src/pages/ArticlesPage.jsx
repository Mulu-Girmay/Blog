import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaClock, FaSearch, FaTag } from "react-icons/fa";
import api from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function ArticlesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  const categoryFilter = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const postsPerPage = 9;

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [categoryFilter, searchQuery, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", postsPerPage);
      params.append("page", currentPage);
      if (categoryFilter) params.append("category", categoryFilter);

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

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search");
    if (query.trim()) {
      setSearchParams({ search: query.trim(), page: 1 });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryClick = (category) => {
    if (category === categoryFilter) {
      setSearchParams({});
    } else {
      setSearchParams({ category, page: 1 });
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold">📚 All Articles</h1>
        <p className="text-ink/60 mt-2">
          {totalPosts} {totalPosts === 1 ? "article" : "articles"} published
        </p>
        <div className="divider-ampersand mt-4">&amp;</div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search articles..."
            className="flex-1 px-4 py-2 bg-white/70 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50"
          />
          <button
            type="submit"
            className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition-colors flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
        </form>
        {searchQuery && (
          <button
            onClick={() => setSearchParams({})}
            className="text-sm text-ink/40 hover:text-burgundy transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({})}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              !categoryFilter
                ? "bg-burgundy text-white"
                : "bg-ink/5 hover:bg-ink/10 text-ink/70"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                categoryFilter === cat
                  ? "bg-burgundy text-white"
                  : "bg-ink/5 hover:bg-ink/10 text-ink/70"
              }`}
            >
              <FaTag className="text-[10px]" /> {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-ink/50 mb-4">
          Showing results for:{" "}
          <span className="font-serif font-semibold text-ink">
            "{searchQuery}"
          </span>
        </p>
      )}

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-serif font-semibold mb-2">
            No articles found
          </h3>
          <p className="text-ink/60">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : categoryFilter
                ? `No articles in "${categoryFilter}" category`
                : "No articles published yet"}
          </p>
          {(searchQuery || categoryFilter) && (
            <button
              onClick={() => setSearchParams({})}
              className="mt-4 text-burgundy hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() =>
                  setSearchParams({
                    page: currentPage - 1,
                    ...(categoryFilter && { category: categoryFilter }),
                  })
                }
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gold/20 rounded-lg hover:bg-burgundy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-ink/60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setSearchParams({
                    page: currentPage + 1,
                    ...(categoryFilter && { category: categoryFilter }),
                  })
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gold/20 rounded-lg hover:bg-burgundy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Article Card Component
function ArticleCard({ post }) {
  return (
    <article className="magazine-card p-5 hover:translate-y-[-4px] transition-all duration-300">
      {post.image && (
        <div
          className="mb-4 rounded-md overflow-hidden h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        />
      )}
      <div className="flex items-center gap-2 text-xs text-ink/50 mb-2">
        <span className="px-2 py-1 bg-burgundy/5 text-burgundy rounded-full">
          {post.category || "General"}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <FaClock className="text-[10px]" /> {post.readTime || 3} min
        </span>
      </div>
      <Link to={`/post/${post.slug}`}>
        <h3 className="font-serif text-xl font-bold leading-tight mb-2 hover:text-burgundy transition-colors line-clamp-2">
          {post.title}
        </h3>
      </Link>
      <p className="text-sm text-ink/70 line-clamp-2 mb-3">{post.excerpt}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="font-serif text-sm">
          {post.author?.name || "Unknown"}
        </span>
        <span className="text-xs text-ink/40">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </article>
  );
}

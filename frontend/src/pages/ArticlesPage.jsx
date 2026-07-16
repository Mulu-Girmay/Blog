import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaClock,
  FaTag,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
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
      if (searchQuery) params.append("search", searchQuery);

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

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-ink">
          📚 All Articles
        </h1>
        <p className="text-ink/60 mt-2">
          {totalPosts} {totalPosts === 1 ? "article" : "articles"} published
        </p>
        {searchQuery && (
          <div className="mt-3 inline-flex items-center gap-3 bg-burgundy/5 px-4 py-2 rounded-full">
            <span className="text-sm text-ink/60">Showing results for:</span>
            <span className="font-serif font-semibold text-burgundy">
              "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-ink/40 hover:text-burgundy transition-colors"
            >
              ✕ Clear
            </button>
          </div>
        )}
        <div className="divider-ampersand mt-6">&amp;</div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              !categoryFilter && !searchQuery
                ? "bg-burgundy text-white"
                : "bg-ink/5 hover:bg-ink/10 text-ink/70"
            }`}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 ${
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
        <p className="text-sm text-ink/50 mb-6 text-center">
          Found{" "}
          <span className="font-serif font-bold text-ink">{totalPosts}</span>{" "}
          results
        </p>
      )}

      {/* Articles Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-serif font-semibold mb-2 text-ink">
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
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() =>
                  setSearchParams({
                    page: currentPage - 1,
                    ...(categoryFilter && { category: categoryFilter }),
                    ...(searchQuery && { search: searchQuery }),
                  })
                }
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gold/20 rounded-lg hover:bg-burgundy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-ink flex items-center gap-1"
              >
                <FaArrowLeft className="text-xs" /> Previous
              </button>
              <span className="text-sm text-ink/60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setSearchParams({
                    page: currentPage + 1,
                    ...(categoryFilter && { category: categoryFilter }),
                    ...(searchQuery && { search: searchQuery }),
                  })
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gold/20 rounded-lg hover:bg-burgundy/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-ink flex items-center gap-1"
              >
                Next <FaArrowRight className="text-xs" />
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
    <article className="group bg-white/50 dark:bg-ink/5 rounded-lg overflow-hidden border border-gold/10 hover:border-burgundy/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {post.image && (
        <div
          className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${post.image})` }}
        />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-ink/50 mb-2">
          <span className="px-2 py-1 bg-burgundy/5 text-burgundy rounded-full flex items-center gap-1">
            <FaTag className="text-[10px]" /> {post.category || "General"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FaClock className="text-[10px]" /> {post.readTime || 3} min
          </span>
        </div>
        <Link to={`/post/${post.slug}`}>
          <h3 className="font-serif text-xl font-bold leading-tight mb-2 group-hover:text-burgundy transition-colors line-clamp-2 text-ink">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-ink/70 line-clamp-2 mb-3">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm border-t border-gold/10 pt-3">
          <span className="font-serif text-xs text-ink/60 flex items-center gap-1">
            <FaUser className="text-[10px]" />{" "}
            {post.author?.name || "Kalayus Blog"}
          </span>
          <span className="text-xs text-ink/40">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </article>
  );
}

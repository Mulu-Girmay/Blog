import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaClock,
  FaArrowRight,
  FaTag,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts?limit=8");
      const allPosts = res.data.posts || [];

      const featuredPost = allPosts.find((p) => p.featured);
      if (featuredPost) {
        setFeatured(featuredPost);
        setPosts(allPosts.filter((p) => p._id !== featuredPost._id));
      } else if (allPosts.length > 0) {
        setFeatured(allPosts[0]);
        setPosts(allPosts.slice(1));
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-br from-burgundy/5 via-cream to-gold/5 py-12 md:py-20 mb-8 md:mb-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-4xl md:text-5xl mb-4">⚖️</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-ink">
              Legal Clarity for
              <span className="block text-burgundy">Everyday Life</span>
            </h1>
            <p className="text-base sm:text-lg text-ink/70 mt-3 md:mt-4 max-w-2xl mx-auto px-4">
              Breaking down complex legal topics into clear, actionable
              insights. No jargon. Just clarity.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 md:mt-8">
              <Link
                to="/articles"
                className="bg-burgundy text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-serif hover:bg-burgundy/90 transition-colors text-sm sm:text-base"
              >
                Browse Articles
              </Link>
              <Link
                to="/ask"
                className="border-2 border-burgundy/30 text-ink px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-serif hover:bg-burgundy/5 transition-colors text-sm sm:text-base"
              >
                Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl mb-8 md:mb-12">
          <div className="magazine-card overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 p-6 sm:p-8 md:p-10">
                <span className="inline-block px-3 py-1 bg-burgundy/10 text-burgundy text-xs font-serif tracking-wider uppercase rounded-full">
                  Featured Article
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mt-2 md:mt-3 mb-2 md:mb-3 leading-tight">
                  <Link
                    to={`/post/${featured.slug}`}
                    className="hover:text-burgundy transition-colors"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-sm sm:text-base text-ink/70 leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 md:mt-4 text-xs sm:text-sm text-ink/50">
                  <span className="flex items-center gap-1">
                    <FaUser className="text-xs" />{" "}
                    {featured.author?.name || "Kalayus Blog"}
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-xs" /> {featured.readTime} min read
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <FaCalendarAlt className="text-xs" />
                    {new Date(featured.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Link
                  to={`/post/${featured.slug}`}
                  className="inline-flex items-center gap-2 mt-3 md:mt-4 text-burgundy font-serif hover:underline text-sm sm:text-base group"
                >
                  Read Full Article{" "}
                  <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              {featured.image && (
                <div
                  className="w-full md:w-1/3 min-h-[200px] md:min-h-[280px] bg-cover bg-center rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
                  style={{ backgroundImage: `url(${featured.image})` }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid - 2 columns */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 border-b border-gold/20 pb-3 md:pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
              Latest Articles
            </h2>
            <p className="text-xs sm:text-sm text-ink/40">
              Recent legal insights and analysis
            </p>
          </div>
          <Link
            to="/articles"
            className="text-sm text-burgundy hover:underline font-serif flex items-center gap-1 mt-2 sm:mt-0"
          >
            View all <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-serif font-semibold text-ink">
              No articles yet
            </h3>
            <p className="text-ink/60 mt-2">
              Check back soon for new legal insights!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {posts.map((post) => (
              <ModernPostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Load More */}
        {posts.length >= 6 && (
          <div className="text-center mt-8 md:mt-10">
            <Link
              to="/articles"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-burgundy/30 text-burgundy rounded-full font-serif hover:bg-burgundy hover:text-white transition-colors text-sm sm:text-base"
            >
              View All Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Modern Post Card Component
function ModernPostCard({ post }) {
  return (
    <article className="group bg-white/50 dark:bg-ink/5 rounded-lg overflow-hidden border border-gold/10 hover:border-burgundy/20 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      {post.image && (
        <div
          className="h-48 sm:h-52 md:h-56 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 flex-shrink-0"
          style={{ backgroundImage: `url(${post.image})` }}
        />
      )}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50 mb-2">
          <span className="px-2 py-1 bg-burgundy/5 text-burgundy rounded-full flex items-center gap-1 text-[10px] sm:text-xs">
            <FaTag className="text-[10px]" /> {post.category || "General"}
          </span>
          <span className="hidden xs:inline">•</span>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs">
            <FaClock className="text-[10px]" /> {post.readTime || 3} min read
          </span>
        </div>
        <Link to={`/post/${post.slug}`}>
          <h3 className="font-serif text-lg sm:text-xl font-bold leading-tight mb-2 group-hover:text-burgundy transition-colors line-clamp-2 text-ink">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-ink/70 line-clamp-2 mb-3 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs sm:text-sm border-t border-gold/10 pt-3 mt-auto">
          <span className="font-serif text-ink/60 flex items-center gap-1">
            <FaUser className="text-[10px]" />{" "}
            {post.author?.name || "Kalayus Blog"}
          </span>
          <span className="text-ink/40">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </article>
  );
}

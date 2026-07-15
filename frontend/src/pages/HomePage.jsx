import React, { useState, useEffect } from "react";
import api from "../services/api";
import Hero from "../components/home/Hero";
import PostCard from "../components/home/PostCard";
import CategorySidebar from "../components/home/CategorySidebar";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts?limit=9");
      setPosts(res.data.posts);
      const featuredPost = res.data.posts.find((p) => p.featured);
      if (featuredPost) setFeatured(featuredPost);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <div>
      <Hero />

      {/* Featured Post (Full Width) */}
      {featured && (
        <div className="container mx-auto px-4 mb-12">
          <div className="magazine-card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 p-8 md:p-12">
                <span className="inline-block px-3 py-1 bg-burgundy/10 text-burgundy text-xs font-serif tracking-wider uppercase mb-4">
                  Featured Article
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                  {featured.title}
                </h2>
                <p className="text-ink/70 mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-ink/50">
                  <span>By {featured.author.name}</span>
                  <span>•</span>
                  <span>{featured.readTime} min read</span>
                </div>
                <a
                  href={`/post/${featured.slug}`}
                  className="inline-block mt-4 text-burgundy font-serif hover:underline"
                >
                  Read Full Article →
                </a>
              </div>
              {featured.image && (
                <div
                  className="md:w-1/3 bg-cover bg-center min-h-[200px] md:min-h-[300px]"
                  style={{ backgroundImage: `url(${featured.image})` }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Magazine Grid - 3 Columns */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content - 3 column grid */}
          <div className="lg:w-3/4">
            <div className="divider-ampersand my-8">Recent Articles</div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <CategorySidebar />
          </div>
        </div>
      </div>
    </div>
  );
}

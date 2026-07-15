import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { FaClock, FaUser, FaCalendarAlt, FaPrint } from "react-icons/fa";
import api from "../services/api";
import DropCap from "../components/common/DropCap";
import PlainEnglishToggle from "../components/common/PlainEnglishToggle";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CommentSection from "../components/common/CommentSection"; // ✅ Add this import

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plainEnglish, setPlainEnglish] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${slug}`);
      setPost(res.data);
    } catch (err) {
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post)
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif">Article not found</h2>
        <Link to="/" className="text-burgundy hover:underline">
          Go home
        </Link>
      </div>
    );

  const content =
    plainEnglish && post.plainEnglish ? post.plainEnglish : post.content;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Article header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-ink/50 mb-4">
          <span className="px-3 py-1 bg-burgundy/5 text-burgundy rounded-full font-serif text-xs tracking-wider uppercase">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FaClock /> {post.readTime} min read
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-ink/60">
          <span className="flex items-center gap-2">
            <FaUser /> {post.author.name}
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <FaCalendarAlt />{" "}
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>•</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 hover:text-burgundy transition-colors"
          >
            <FaPrint /> Print
          </button>
        </div>
      </header>

      {/* Plain English Toggle */}
      <div className="bg-cream/50 border border-gold/20 rounded-lg p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-semibold text-sm">
            📖 Read in Plain English
          </h4>
          <p className="text-xs text-ink/60">
            Simplify legal jargon with one click
          </p>
        </div>
        <PlainEnglishToggle
          enabled={plainEnglish}
          onToggle={() => setPlainEnglish(!plainEnglish)}
          hasPlainVersion={!!post.plainEnglish}
        />
      </div>

      {/* Article content with Drop Cap */}
      <article className="prose prose-lg max-w-none font-body">
        <DropCap>
          <ReactMarkdown>{content}</ReactMarkdown>
        </DropCap>
      </article>

      {/* Author bio */}
      <div className="magazine-card p-6 mt-12 flex flex-wrap items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-burgundy/10 flex items-center justify-center text-2xl">
          ⚖️
        </div>
        <div className="flex-1">
          <h4 className="font-serif font-bold">{post.author.name}</h4>
          <p className="text-sm text-ink/60">
            {post.author.bio ||
              "Advocate simplifying the law for everyday people."}
          </p>
        </div>
        <Link
          to="/ask"
          className="bg-burgundy/10 text-burgundy px-4 py-2 rounded-full text-sm hover:bg-burgundy/20 transition-colors"
        >
          Ask a Question
        </Link>
      </div>

      <CommentSection postId={post._id} />
    </div>
  );
}

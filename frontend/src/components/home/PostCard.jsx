import React from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark, FaClock } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post }) {
  const [saved, setSaved] = React.useState(false);

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
          {post.category}
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <FaClock className="text-[10px]" /> {post.readTime} min
        </span>
      </div>
      <Link to={`/post/${post.slug}`}>
        <h3 className="font-serif text-xl font-bold leading-tight mb-2 hover:text-burgundy transition-colors">
          {post.title}
        </h3>
      </Link>
      <p className="text-sm text-ink/70 line-clamp-2 mb-3">{post.excerpt}</p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm">{post.author.name}</span>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className="text-ink/30 hover:text-burgundy transition-colors"
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
      <div className="mt-2 text-xs text-ink/40">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </div>
    </article>
  );
}

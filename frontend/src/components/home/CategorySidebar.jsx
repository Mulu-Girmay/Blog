import React from "react";
import { Link } from "react-router-dom";
import { FaTag, FaEnvelope, FaLinkedin, FaTwitter } from "react-icons/fa";

const categories = [
  "General Legal Articles",
  // Add more categories later
];

export default function CategorySidebar() {
  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="magazine-card p-6">
        <h3 className="font-serif text-lg font-bold mb-4">Practice Areas</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                to={`/?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-2 text-ink/70 hover:text-burgundy transition-colors text-sm"
              >
                <FaTag className="text-xs" /> {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="magazine-card p-6 bg-burgundy/5 border-burgundy/10">
        <h3 className="font-serif text-lg font-bold mb-2">
          📬 Weekly Legal Tips
        </h3>
        <p className="text-sm text-ink/60 mb-4">
          Get one clear, actionable legal insight every Friday.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-2 bg-white/70 border border-gold/20 rounded-lg text-sm focus:outline-none focus:border-burgundy/50"
          />
          <button
            type="submit"
            className="w-full bg-burgundy text-white py-2 rounded-lg text-sm hover:bg-burgundy/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Social */}
      <div className="magazine-card p-6">
        <h3 className="font-serif text-lg font-bold mb-4">Connect</h3>
        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="text-ink/40 hover:text-burgundy transition-colors text-2xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="#"
            className="text-ink/40 hover:text-burgundy transition-colors text-2xl"
          >
            <FaTwitter />
          </a>
          <a
            href="mailto:your@email.com"
            className="text-ink/40 hover:text-burgundy transition-colors text-2xl"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </aside>
  );
}

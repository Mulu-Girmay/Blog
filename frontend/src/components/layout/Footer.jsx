import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-cream/50 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between text-sm text-ink/50">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/about" className="hover:text-burgundy transition-colors py-1">About</Link>
            <Link to="/contact" className="hover:text-burgundy transition-colors py-1">Contact</Link>
            <Link to="/privacy" className="hover:text-burgundy transition-colors py-1">Privacy</Link>
          </div>
          <div className="text-center">
            <p className="text-xs">⚖️ This blog is for informational purposes only. Not legal advice.</p>
            <p className="text-xs mt-1">&copy; {new Date().getFullYear()} Your Name, Esq. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

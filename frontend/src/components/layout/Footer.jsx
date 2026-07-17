import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-cream/50 mt-16">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between text-base text-ink/50">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <Link to="/about" className="hover:text-burgundy transition-colors py-2 text-base">About</Link>
            <Link to="/contact" className="hover:text-burgundy transition-colors py-2 text-base">Contact</Link>
            <Link to="/privacy" className="hover:text-burgundy transition-colors py-2 text-base">Privacy</Link>
          </div>
          <div className="text-center">
            <p className="text-sm">⚖️ This blog is for informational purposes only. Not legal advice.</p>
            <p className="text-sm mt-2">&copy; {new Date().getFullYear()} Your Name, Esq. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

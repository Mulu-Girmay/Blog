import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-cream/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-ink/50">
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-burgundy transition-colors">
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-burgundy transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="hover:text-burgundy transition-colors"
            >
              Privacy
            </Link>
          </div>
          <div className="text-center mt-3 md:mt-0">
            <p className="text-xs">
              ⚖️ This blog is for informational purposes only. Not legal advice.
            </p>
            <p className="text-xs mt-1">
              &copy; {new Date().getFullYear()} Your Name, Esq. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

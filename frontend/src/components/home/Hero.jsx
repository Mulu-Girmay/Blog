import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaQuestionCircle } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative py-16 mb-12 paper-texture">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
              Law made <span className="text-burgundy italic">simple</span>.
              <br />
              No jargon. Just <span className="text-gold">clarity</span>.
            </h1>
            <p className="mt-4 text-lg text-ink/70 font-body max-w-xl mx-auto md:mx-0">
              Breaking down complex legal topics into clear, actionable insights
              for everyday people.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/articles"
                className="bg-burgundy text-white px-8 py-3 rounded-full font-serif hover:bg-burgundy/90 transition-colors flex items-center gap-2"
              >
                Browse Articles <FaArrowRight />
              </Link>
              <Link
                to="/ask"
                className="border-2 border-burgundy/30 text-ink px-8 py-3 rounded-full font-serif hover:bg-burgundy/5 transition-colors flex items-center gap-2"
              >
                <FaQuestionCircle /> Ask a Question
              </Link>
            </div>
          </div>

          {/* Right - Author badge */}
          <div className="flex-1 max-w-sm">
            <div className="magazine-card p-8 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-burgundy/10 flex items-center justify-center text-4xl mb-4">
                ⚖️
              </div>
              <h3 className="font-serif text-xl font-bold">Your Name</h3>
              <p className="text-sm text-ink/60">Advocate | Legal Educator</p>
              <div className="divider-ampersand my-4">&amp;</div>
              <p className="text-sm text-ink/70 italic">
                "Demystifying the law, one article at a time."
              </p>
              <div className="mt-4 flex justify-center space-x-4 text-xs text-ink/50">
                <span>10+ years experience</span>
                <span>•</span>
                <span>100+ articles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

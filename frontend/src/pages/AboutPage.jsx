import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-5xl block mb-4">⚖️</span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold">
          About This Blog
        </h1>
        <div className="divider-ampersand mt-4">&amp;</div>
      </div>

      {/* About Content */}
      <div className="space-y-8">
        {/* Mission */}
        <div className="magazine-card p-5 md:p-8">
          <h2 className="text-2xl font-serif font-bold mb-4">Our Mission</h2>
          <p className="text-ink/80 leading-relaxed">
            This blog is dedicated to making the law{" "}
            <strong>accessible, understandable, and approachable</strong> for
            everyone. No jargon. No confusion. Just clear, practical legal
            insights.
          </p>
          <p className="text-ink/80 leading-relaxed mt-3">
            Whether you're dealing with a legal issue, curious about your
            rights, or just want to understand how the law works — you're in the
            right place.
          </p>
        </div>

        {/* Author Section */}
        <div className="magazine-card p-5 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Author Avatar */}
            <div className="w-32 h-32 rounded-full bg-burgundy/10 flex items-center justify-center text-5xl flex-shrink-0">
              ⚖️
            </div>

            {/* Author Info */}
            <div>
              <h2 className="text-2xl font-serif font-bold">kalayu</h2>
              <p className="text-burgundy font-serif">
                Advocate &amp; Legal Educator
              </p>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-ink/60">
                <span className="flex items-center gap-1">
                  <FaGraduationCap /> LL.B, LL.M
                </span>
                <span className="flex items-center gap-1">
                  <FaBriefcase /> 5+ Years Experience
                </span>
                <span className="flex items-center gap-1">
                  <FaAward /> Bar Council Certified
                </span>
              </div>

              <p className="text-ink/70 mt-3 leading-relaxed">
                I'm a practicing lawyer with over a decade of experience in
                criminal, family, and constitutional law. I started this blog to
                bridge the gap between complex legal concepts and everyday
                people.
              </p>
            </div>
          </div>
        </div>

        {/* What You'll Find Here */}
        <div className="magazine-card p-5 md:p-8">
          <h2 className="text-2xl font-serif font-bold mb-4">
            What You'll Find Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-cream/50 p-4 rounded-lg">
              <span className="text-2xl block mb-2">📖</span>
              <h4 className="font-serif font-bold">Clear Legal Articles</h4>
              <p className="text-sm text-ink/60">
                Explained in plain English, not legalese
              </p>
            </div>
            <div className="bg-cream/50 p-4 rounded-lg">
              <span className="text-2xl block mb-2">❓</span>
              <h4 className="font-serif font-bold">Reader Questions</h4>
              <p className="text-sm text-ink/60">
                Your questions answered and turned into content
              </p>
            </div>
            <div className="bg-cream/50 p-4 rounded-lg">
              <span className="text-2xl block mb-2">📰</span>
              <h4 className="font-serif font-bold">Current Issues</h4>
              <p className="text-sm text-ink/60">
                Analysis of recent laws and court rulings
              </p>
            </div>
            <div className="bg-cream/50 p-4 rounded-lg">
              <span className="text-2xl block mb-2">💡</span>
              <h4 className="font-serif font-bold">Practical Tips</h4>
              <p className="text-sm text-ink/60">
                Actionable advice for real-life situations
              </p>
            </div>
          </div>
        </div>

        {/* Why This Blog is Different */}
        <div className="magazine-card p-5 md:p-8 bg-burgundy/5 border-burgundy/10">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Why This Blog is Different
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-burgundy text-xl leading-none">✦</span>
              <div>
                <strong>No Jargon Policy</strong>
                <p className="text-sm text-ink/60">
                  Every article has a "Plain English" version for clarity
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-burgundy text-xl leading-none">✦</span>
              <div>
                <strong>Reader-Driven Content</strong>
                <p className="text-sm text-ink/60">
                  Your questions shape what I write about
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-burgundy text-xl leading-none">✦</span>
              <div>
                <strong>Practical &amp; Actionable</strong>
                <p className="text-sm text-ink/60">
                  Not just theory — what you can actually do
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-burgundy text-xl leading-none">✦</span>
              <div>
                <strong>Completely Free</strong>
                <p className="text-sm text-ink/60">
                  Legal knowledge should be accessible to everyone
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="magazine-card p-5 md:p-8 border border-amber-200 bg-amber-50/30">
          <h2 className="text-2xl font-serif font-bold text-amber-800 mb-3">
            ⚠️ Legal Disclaimer
          </h2>
          <p className="text-sm text-amber-700 leading-relaxed">
            The content on this blog is for{" "}
            <strong>informational purposes only</strong>
            and does not constitute legal advice. Every legal situation is
            unique, and laws vary by jurisdiction. Always consult a qualified
            attorney for advice specific to your situation.
          </p>
          <p className="text-sm text-amber-700 leading-relaxed mt-2">
            Reading this blog does not create an attorney-client relationship
            between you and the author.
          </p>
        </div>

        {/* Connect */}
        <div className="magazine-card p-5 md:p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Connect With Me
          </h2>
          <p className="text-ink/60 mb-6">
            Have a question or suggestion? I'd love to hear from you!
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="text-3xl text-ink/40 hover:text-burgundy transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="text-3xl text-ink/40 hover:text-burgundy transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="mailto:your@email.com"
              className="text-3xl text-ink/40 hover:text-burgundy transition-colors"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
          <div className="mt-6">
            <Link
              to="/ask"
              className="bg-burgundy text-white px-8 py-3 rounded-full font-serif hover:bg-burgundy/90 transition-colors inline-block"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

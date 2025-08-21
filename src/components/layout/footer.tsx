"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUpRight } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Background with modern effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]" />
      
      {/* Aurora effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-brand/5 blur-3xl animate-pulse" />
        <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-purple-500/5 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      {/* Main footer content */}
      <div className="relative">
        {/* Top section with glassmorphic effect */}
        <div className="container py-16 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand section - spans 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">
                  Learnovium
                </h3>
                <p className="text-[var(--fg)]/80 text-lg leading-relaxed max-w-sm">
                  Master any skill with AI-powered learning paths. Get personalized daily lessons and achieve your learning goals.
                </p>
              </div>
              
              {/* Social links with modern design */}
              <div className="flex items-center gap-4">
                <Link 
                  href="https://twitter.com/learnovium" 
                  className="group p-3 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-[var(--fg)]/70 group-hover:text-brand transition-colors" />
                </Link>
                <Link 
                  href="https://github.com/learnovium" 
                  className="group p-3 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="View our GitHub"
                >
                  <Github className="w-5 h-5 text-[var(--fg)]/70 group-hover:text-brand transition-colors" />
                </Link>
                <Link 
                  href="https://linkedin.com/company/learnovium" 
                  className="group p-3 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-[var(--fg)]/70 group-hover:text-brand transition-colors" />
                </Link>
                <Link 
                  href="mailto:hello@learnovium.com" 
                  className="group p-3 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Send us an email"
                >
                  <Mail className="w-5 h-5 text-[var(--fg)]/70 group-hover:text-brand transition-colors" />
                </Link>
              </div>
            </div>

            {/* Product links - spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-lg font-semibold text-[var(--fg)]">Product</h4>
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/app" 
                  className="group flex items-center text-[var(--fg)]/70 hover:text-[var(--fg)] transition-all duration-300 hover:translate-x-1"
                >
                  <span>Dashboard</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/app/create" 
                  className="group flex items-center text-[var(--fg)]/70 hover:text-[var(--fg)] transition-all duration-300 hover:translate-x-1"
                >
                  <span>Create Goal</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/app/plans" 
                  className="group flex items-center text-[var(--fg)]/70 hover:text-[var(--fg)] transition-all duration-300 hover:translate-x-1"
                >
                  <span>Learning Plans</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </nav>
            </div>

            {/* Company links - spans 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-lg font-semibold text-[var(--fg)]">Company</h4>
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/about" 
                  className="group flex items-center text-[var(--fg)]/70 hover:text-[var(--fg)] transition-all duration-300 hover:translate-x-1"
                >
                  <span>About</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/privacy" 
                  className="group flex items-center text-[var(--fg)]/70 hover:text-[var(--fg)] transition-all duration-300 hover:translate-x-1"
                >
                  <span>Privacy</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/terms" 
                  className="group flex items-center text-[var(--fg)]/70 hover:text-[var(--fg)] transition-all duration-300 hover:translate-x-1"
                >
                  <span>Terms</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </nav>
            </div>

            {/* Newsletter signup - spans 4 columns */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[var(--fg)]">Stay Updated</h4>
                <p className="text-[var(--fg)]/70 text-sm leading-relaxed">
                  Get the latest learning tips, feature updates, and AI insights delivered to your inbox.
                </p>
              </div>
              
              {/* Newsletter form with modern design */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all duration-300 placeholder:text-[var(--fg)]/50"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-brand to-purple-600 text-white font-medium rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand/20">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with glassmorphic border */}
        <div className="relative">
          {/* Glassmorphic border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
          
          <div className="container py-8 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Copyright with heart icon */}
              <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60">
                <span>© {new Date().getFullYear()} Learnovium. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>for learners worldwide.</span>
              </div>
              
              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                className="group p-3 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Back to top"
              >
                <div className="w-5 h-5 border-2 border-[var(--fg)]/40 rounded-sm group-hover:border-brand transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
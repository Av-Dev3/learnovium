"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUpRight } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-indigo-50/50 dark:from-transparent dark:via-purple-900/10 dark:to-slate-800/50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-cyan-400/10 blur-3xl animate-pulse" />
        <div className="absolute -top-20 right-1/4 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-indigo-400/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-400/10 via-cyan-400/10 to-purple-400/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Main footer content */}
      <div className="relative">
        {/* Glassmorphism container */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl mx-6 mb-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand section - spans 6 columns */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600">
                  Learnovium
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-sm">
                  Master any skill with AI-powered learning paths. Get personalized daily lessons and achieve your learning goals.
                </p>
              </div>
              
              {/* Social links with modern design */}
              <div className="flex items-center gap-4">
                <Link 
                  href="https://twitter.com/learnovium" 
                  className="group p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </Link>
                <Link 
                  href="https://github.com/learnovium" 
                  className="group p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="View our GitHub"
                >
                  <Github className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </Link>
                <Link 
                  href="https://linkedin.com/company/learnovium" 
                  className="group p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:border-cyan-300 dark:hover:border-cyan-600 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                </Link>
                <Link 
                  href="mailto:hello@learnovium.com" 
                  className="group p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  aria-label="Send us an email"
                >
                  <Mail className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </Link>
              </div>
            </div>


            {/* Company links - spans 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Company</h4>
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/about" 
                  className="group flex items-center text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:translate-x-1"
                >
                  <span>About</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/pricing" 
                  className="group flex items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:translate-x-1"
                >
                  <span>Pricing</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/privacy" 
                  className="group flex items-center text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-300 hover:translate-x-1"
                >
                  <span>Privacy</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/terms" 
                  className="group flex items-center text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:translate-x-1"
                >
                  <span>Terms</span>
                  <ArrowUpRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </nav>
            </div>

            {/* Newsletter signup - spans 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Stay Updated</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Get the latest learning tips, feature updates, and AI insights delivered to your inbox.
                </p>
              </div>
              
              {/* Newsletter form with modern design */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 focus:border-purple-300 dark:focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-medium rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800">
                  Subscribe
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Bottom section with glassmorphic design */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl mx-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Copyright with heart icon */}
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span>© {new Date().getFullYear()} Learnovium. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>for learners worldwide.</span>
              </div>
              
              {/* Back to top button */}
              <button
                onClick={scrollToTop}
                className="group p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                aria-label="Back to top"
              >
                <div className="w-5 h-5 border-2 border-slate-400 dark:border-slate-500 rounded-sm group-hover:border-purple-600 dark:group-hover:border-purple-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]/60 bg-gradient-to-b from-transparent to-[color-mix(in_oklab,var(--bg)_80%,black_6%)]">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-lg font-semibold bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent mb-4">Learnovium</h3>
            <p className="text-[var(--fg)]/70 text-sm leading-relaxed">
              Master any skill with AI-powered learning paths. Get personalized daily lessons and achieve your learning goals.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/app" className="text-[var(--fg)]/70 hover:text-[var(--fg)] transition-colors">Dashboard</Link>
              <Link href="/app/create" className="text-[var(--fg)]/70 hover:text-[var(--fg)] transition-colors">Create Goal</Link>
              <Link href="/app/plans" className="text-[var(--fg)]/70 hover:text-[var(--fg)] transition-colors">Learning Plans</Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/about" className="text-[var(--fg)]/70 hover:text-[var(--fg)] transition-colors">About</Link>
              <Link href="/privacy" className="text-[var(--fg)]/70 hover:text-[var(--fg)] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[var(--fg)]/70 hover:text-[var(--fg)] transition-colors">Terms</Link>
            </nav>
          </div>

          {/* Follow */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Follow</h4>
            <div className="flex items-center gap-4 text-[var(--fg)]/70">
              <Link href="/twitter" className="hover:text-[var(--fg)] transition-colors">Twitter</Link>
              <Link href="/github" className="hover:text-[var(--fg)] transition-colors">GitHub</Link>
              <Link href="/linkedin" className="hover:text-[var(--fg)] transition-colors">LinkedIn</Link>
            </div>
          </div>
        </div>

        <div className="col-span-full pt-8 border-t border-[var(--border)]/40">
          <p className="text-sm text-[var(--fg)]/60">© {new Date().getFullYear()} Learnovium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
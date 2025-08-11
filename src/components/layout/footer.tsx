import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="container flex flex-col items-center justify-between gap-6 py-12 md:h-24 md:flex-row md:py-0">
        {/* Left: Brand and Description */}
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6 md:px-0">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold text-[var(--brand)] mb-2">LearnOV AI</h3>
            <p className="text-sm text-[var(--muted)] max-w-xs">
              AI-powered learning paths, delivered daily.
            </p>
          </div>
        </div>

        {/* Center: Copyright */}
        <div className="text-center">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} LearnOV AI. All rights reserved.
          </p>
        </div>

        {/* Right: Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/about"
            className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
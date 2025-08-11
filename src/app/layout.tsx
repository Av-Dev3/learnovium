import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "LearnovAI",
    template: "LearnovAI | %s",
  },
  description: "AI-powered learning paths with daily micro-lessons and reminders.",
  keywords: ["AI learning", "personalized education", "daily lessons", "micro-learning", "adaptive learning"],
  authors: [{ name: "LearnovAI Team" }],
  creator: "LearnovAI",
  publisher: "LearnovAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://learnovai.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://learnovai.com",
    title: "LearnovAI - AI-Powered Learning Paths",
    description: "AI-powered learning paths with daily micro-lessons and reminders.",
    siteName: "LearnovAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnovAI - AI-Powered Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnovAI - AI-Powered Learning Paths",
    description: "AI-powered learning paths with daily micro-lessons and reminders.",
    images: ["/og-image.png"],
    creator: "@learnovai",
    site: "@learnovai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Replace with real auth in Phase 1
  const isLoggedIn = false; // Set to true to test logged-in state
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <AppHeader isLoggedIn={isLoggedIn} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

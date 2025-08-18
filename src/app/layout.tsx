import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: "Learnovium",
    template: "Learnovium | %s",
  },
  description: "Master any skill with AI-powered learning paths. Get personalized daily lessons, track your progress, and achieve your learning goals with intelligent AI guidance.",
  keywords: ["AI learning", "skill development", "personalized education", "learning paths", "artificial intelligence"],
  authors: [{ name: "Learnovium Team" }],
  creator: "Learnovium",
  publisher: "Learnovium",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? "https://learnovium.com" : "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NODE_ENV === 'production' ? "https://learnovium.com" : "http://localhost:3000",
    title: "Learnovium - AI-Powered Learning Paths",
    description: "Master any skill with AI-powered learning paths. Get personalized daily lessons, track your progress, and achieve your learning goals.",
    siteName: "Learnovium",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Learnovium - AI-Powered Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learnovium - AI-Powered Learning Paths",
    description: "Master any skill with AI-powered learning paths. Get personalized daily lessons, track your progress, and achieve your learning goals.",
    creator: "@learnovium",
    site: "@learnovium",
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
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${interTight.variable}`}>
      <body className={`font-sans antialiased selection:bg-brand/20 selection:text-[var(--fg)]`}>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

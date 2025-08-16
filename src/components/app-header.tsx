"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, ChevronRight, LogOut } from "lucide-react";
import AdminLinkClient from "./AdminLinkClient";

interface AppHeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatarUrl?: string;
}

export function AppHeader({ isLoggedIn = false, userName, userAvatarUrl }: AppHeaderProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/auth", label: "Get Started" },
  ];

  const userMenuItems = [
    { href: "/app", label: "Dashboard" },
    { href: "/app/plans", label: "Plans" },
            { href: "/app/plans", label: "Plans" },
    { href: "/app/settings", label: "Settings" },
  ];

  const handleSignOut = () => {
    setUserMenuOpen(false);
    // Implement actual sign out logic here
    console.log("Signing out...");
  };

  const toggleUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Homepage: Toggling user menu from:", userMenuOpen, "to:", !userMenuOpen);
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setUserMenuOpen(prev => !prev);
  };

  console.log("AppHeader render - userMenuOpen:", userMenuOpen, "isLoggedIn:", isLoggedIn);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)]/40 bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="font-heading text-lg font-bold text-white">L</span>
              </div>
              <span className="font-heading text-xl font-bold text-[var(--fg)]">Learnovium</span>
            </Link>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-brand/20 to-purple-500/20 text-brand"
                    : "text-[var(--fg)]/70 hover:text-[var(--fg)] hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Auth/Actions */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <ThemeToggle />
                <Button variant="ghost" size="sm" shape="pill" asChild className="hidden sm:inline-flex">
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" shape="pill" asChild className="bg-gradient-to-r from-brand to-purple-600 hover:opacity-95 text-white border-0 shadow-md hidden sm:inline-flex">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <AdminLinkClient />
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="group relative h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={toggleUserMenu}
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 pointer-events-none">
                      <AvatarImage src={userAvatarUrl} alt={userName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
                        {userName ? userName.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Animated indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-white transition-all duration-300 ${
                      userMenuOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-60'
                    }`} />
                  </Button>

                {userMenuOpen && buttonRect && typeof window !== 'undefined' && createPortal(
                  <>
                    {/* Backdrop with blur */}
                    <div 
                      className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Modern User Menu */}
                    <div 
                      className="fixed z-[110] w-80 sm:w-80"
                      style={{
                        top: buttonRect.bottom + 8,
                        left: window.innerWidth < 640 ? 8 : Math.max(8, Math.min(buttonRect.right - 320, window.innerWidth - 328)), // Full width on mobile with padding
                        right: window.innerWidth < 640 ? 8 : 'auto', // Add right padding on mobile
                        width: window.innerWidth < 640 ? 'auto' : '320px', // Auto width on mobile
                      }}
                    >
                      <div className="relative">
                        {/* Arrow pointer */}
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200/50 shadow-lg" />
                        
                        {/* Main menu container */}
                        <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-200/50 overflow-hidden">
                          {/* Header with gradient */}
                          <div className="relative p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
                            {/* Background pattern */}
                            <div className="absolute inset-0 bg-white/10 opacity-30" />
                            
                            <div className="relative flex items-center space-x-4">
                              <div className="relative">
                                <Avatar className="h-16 w-16 ring-4 ring-white/30 shadow-lg">
                                  <AvatarImage src={userAvatarUrl} alt={userName} />
                                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-sm">
                                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                                  </AvatarFallback>
                                </Avatar>
                                {/* Online status */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-white shadow-lg" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate">{userName || "User Account"}</h3>
                                <p className="text-indigo-100 text-sm truncate">{userName || "user@example.com"}</p>
                                <div className="flex items-center mt-2 space-x-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                                    Premium
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                                    Verified
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-3 space-y-1">
                            {userMenuItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="group w-full flex items-center px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-200 mr-3">
                                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">{item.label}</div>
                                  <div className="text-xs text-gray-500">Navigate to {item.label.toLowerCase()}</div>
                                </div>
                                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                  <ChevronRight className="h-4 w-4" />
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Footer with sign out */}
                          <div className="p-3 border-t border-gray-100">
                            <button
                              onClick={handleSignOut}
                              className="group w-full flex items-center px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 transition-all duration-200 mr-3">
                                <LogOut className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">Sign Out</div>
                                <div className="text-xs text-red-500">End your session</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>,
                  document.body
                )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl p-3">
                <Menu className="h-5 w-5 text-[var(--fg)]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 bg-[var(--card)]/95 backdrop-blur-xl border-l border-[var(--border)]/60">
              <div className="flex flex-col h-full overflow-hidden">
                {/* Mobile Header - Simplified */}
                <div className="flex items-center p-6 border-b border-[var(--border)]/60 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="font-heading text-lg font-bold text-white">L</span>
                    </div>
                    <span className="font-heading text-xl font-bold text-[var(--fg)]">Learnovium</span>
                  </div>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                  {/* Mobile Navigation */}
                  <nav className="p-6 space-y-2">
                    {navItems.map((item) => {
                      const isItemActive = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group block p-4 rounded-2xl transition-all duration-200 ${
                            isItemActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                              : "text-[var(--fg,_#101010)]/70 hover:text-[var(--fg,_#101010)] hover:bg-[var(--muted)]/50"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl transition-all duration-200 ${
                              isItemActive ? "bg-white/20" : "bg-[var(--muted)]/50 group-hover:bg-[var(--muted)]/70"
                            }`}>
                              <div className={`w-6 h-6 rounded-full ${
                                isItemActive ? "bg-white" : "bg-[var(--fg,_#101010)]/60"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold text-base ${
                                isItemActive ? "text-white" : "text-[var(--fg,_#101010)]"
                              }`}>
                                {item.label}
                              </div>
                              <div className={`text-sm ${
                                isItemActive ? "text-white/80" : "text-[var(--fg,_#101010)]/50"
                              }`}>
                                Navigate to {item.label.toLowerCase()}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Footer - Simplified */}
                  <div className="p-6 border-t border-[var(--border)]/60">
                    {isLoggedIn ? (
                      <div className="space-y-4">
                        {/* Simple User Info */}
                        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[var(--muted)]/30">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={userAvatarUrl} alt={userName} />
                            <AvatarFallback className="bg-brand text-white font-medium">
                              {userName ? userName.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[var(--fg)]">{userName || "User"}</p>
                            <p className="text-sm text-[var(--fg)]/60">Signed In</p>
                          </div>
                        </div>
                        
                        {/* Go to Dashboard */}
                        <Button className="w-full bg-gradient-to-r from-brand to-purple-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] rounded-2xl py-4 text-base font-semibold" asChild>
                          <Link href="/app">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span>Go to Dashboard</span>
                            </div>
                          </Link>
                        </Button>
                        
                        {/* Sign Out */}
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-brand to-purple-600 text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] rounded-2xl py-4 text-base font-semibold" asChild>
                          <Link href="/auth">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              <span>Start Learning Free</span>
                            </div>
                          </Link>
                        </Button>
                        
                        <Button variant="outline" className="w-full border-2 border-[var(--border)] hover:border-brand/50 hover:bg-muted/30 transition-all duration-300 rounded-2xl py-4 text-base font-medium" asChild>
                          <Link href="/auth/sign-in">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-[var(--fg)]/60 rounded-full" />
                              <span>Sign In</span>
                            </div>
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 
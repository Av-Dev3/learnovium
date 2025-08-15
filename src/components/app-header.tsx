"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, ChevronRight, Settings, HelpCircle, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

interface AppHeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatarUrl?: string;
}

export function AppHeader({ isLoggedIn = false, userName, userAvatarUrl }: AppHeaderProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/auth", label: "Get Started" },
  ];

  const userMenuItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/plans", label: "Plans" },
    { href: "/app/goals", label: "Goals" },
    { href: "/app/settings", label: "Settings" },
  ];

  const handleSignOut = () => {
    setUserMenuOpen(false);
    // Implement actual sign out logic here
    console.log("Signing out...");
  };

  const toggleUserMenu = () => {
    console.log("Toggling user menu from:", userMenuOpen, "to:", !userMenuOpen);
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" shape="pill" asChild className="hidden sm:inline-flex">
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" shape="pill" asChild className="bg-gradient-to-r from-brand to-purple-600 hover:opacity-95 text-white border-0 shadow-md hidden sm:inline-flex">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="group relative h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={toggleUserMenu}
                >
                  <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
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

                {userMenuOpen && (
                  <>
                    {/* Debug info */}
                    <div className="fixed top-0 left-0 z-[9999] bg-red-500 text-white p-2 text-xs">
                      MENU IS OPEN! userMenuOpen: {userMenuOpen.toString()}
                    </div>
                    
                    {/* Backdrop with blur */}
                    <div 
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Simple Debug Menu - This should be impossible to miss! */}
                    <div className="fixed top-20 right-4 z-[9999] w-80 bg-red-500 border-4 border-yellow-400 p-4 text-white text-center">
                      <div className="text-lg font-bold">🎯 MENU CONTAINER IS HERE! 🎯</div>
                      <div className="text-sm">This should be impossible to miss!</div>
                      <div className="text-xs mt-2">userMenuOpen: {userMenuOpen.toString()}</div>
                      <div className="text-xs">isLoggedIn: {isLoggedIn.toString()}</div>
                      <button 
                        onClick={() => setUserMenuOpen(false)}
                        className="mt-2 px-4 py-2 bg-white text-red-500 rounded font-bold"
                      >
                        CLOSE MENU
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-2 hover:bg-muted/50 transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] sm:w-[380px] p-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)] to-[var(--muted)]/20 backdrop-blur-2xl border-l border-[var(--border)]/40">
              <div className="flex flex-col h-full">
                {/* Header with gradient background */}
                <div className="relative overflow-hidden bg-gradient-to-r from-brand/10 via-purple-500/10 to-brand/10 p-6 border-b border-[var(--border)]/30">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--brand),transparent_50%)] opacity-20" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="font-heading text-lg font-bold text-white">L</span>
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-[var(--fg)]">Learnovium</h3>
                        <p className="text-sm text-[var(--fg)]/60">AI Learning Platform</p>
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
                
                {/* Navigation Section */}
                <div className="flex-1 p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--fg)]/60 uppercase tracking-wider mb-4 px-2">Navigation</h4>
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                            isActive(item.href)
                              ? "bg-gradient-to-r from-brand/20 to-purple-500/20 text-brand border border-brand/30 shadow-lg"
                              : "text-[var(--fg)]/80 hover:bg-muted/50 hover:text-[var(--fg)] hover:shadow-md"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-3 transition-all duration-300 ${
                            isActive(item.href) 
                              ? "bg-brand shadow-lg shadow-brand/50" 
                              : "bg-[var(--fg)]/30 group-hover:bg-[var(--fg)]/50"
                          }`} />
                          <span className="font-medium">{item.label}</span>
                          {isActive(item.href) && (
                            <div className="ml-auto w-2 h-2 bg-brand rounded-full animate-pulse" />
                          )}
                        </Link>
                      ))}
                    </nav>
                  </div>

                  {/* User Section */}
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[var(--fg)]/60 uppercase tracking-wider mb-4 px-2">Account</h4>
                      
                      {/* Modern User Profile Card */}
                      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
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
                            <h3 className="font-bold text-lg">{userName || "User Account"}</h3>
                            <p className="text-indigo-100 text-sm">Premium Member</p>
                            <div className="flex items-center mt-3 space-x-2">
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
                      
                      {/* Enhanced Menu Items */}
                      <div className="space-y-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center p-4 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                          >
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-200 mr-4">
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-base">{item.label}</div>
                              <div className="text-sm text-gray-500">Navigate to {item.label.toLowerCase()}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {/* Enhanced Sign Out */}
                      <button
                        onClick={handleSignOut}
                        className="group w-full flex items-center p-4 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 group-hover:bg-red-100 transition-all duration-200 mr-4">
                          <LogOut className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base">Sign Out</div>
                          <div className="text-sm text-red-500">End your session</div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[var(--fg)]/60 uppercase tracking-wider mb-4 px-2">Get Started</h4>
                      
                      {/* CTA Cards */}
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
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border)]/30 bg-gradient-to-t from-[var(--muted)]/20 to-transparent">
                  <div className="text-center">
                    <p className="text-xs text-[var(--fg)]/50 mb-2">Always learning, always growing</p>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                      <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                    </div>
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
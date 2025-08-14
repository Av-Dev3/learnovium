"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AppHeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatarUrl?: string;
}

export function AppHeader({ isLoggedIn = false, userName, userAvatarUrl }: AppHeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
  ];

  const userMenuItems = [
    { href: "/app/dashboard", label: "Dashboard" },
    { href: "/app/plans", label: "Plans" },
    { href: "/app/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)]/60 bg-[var(--bg)]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg)]/60">
      <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">Learnovium</span>
          </Link>
        </div>

        {/* Center: Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors hover:text-[var(--fg)] ${
                isActive(item.href)
                  ? "text-[var(--fg)] font-semibold"
                  : "text-[var(--fg)]/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth/Actions */}
        <div className="flex items-center gap-2">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userAvatarUrl} alt={userName} />
                    <AvatarFallback>
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {userName && (
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userName}</p>
                    </div>
                  </div>
                )}
                <DropdownMenuSeparator />
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
                      
                      {/* User Profile Card */}
                      <div className="bg-gradient-to-r from-[var(--card)] to-[var(--muted)]/30 rounded-2xl p-4 border border-[var(--border)]/40 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 ring-2 ring-brand/20">
                            <AvatarImage src={userAvatarUrl} alt={userName} />
                            <AvatarFallback className="bg-gradient-to-br from-brand to-purple-600 text-white font-semibold text-lg">
                              {userName ? userName.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-[var(--fg)]">{userName || "User"}</p>
                            <p className="text-sm text-[var(--fg)]/60">Premium Member</p>
                          </div>
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      </div>

                      {/* Account Navigation */}
                      <nav className="space-y-2">
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="group flex items-center px-4 py-3 rounded-2xl text-[var(--fg)]/80 hover:bg-muted/50 hover:text-[var(--fg)] transition-all duration-300 hover:shadow-md"
                          >
                            <div className="w-2 h-2 rounded-full mr-3 bg-[var(--fg)]/30 group-hover:bg-[var(--fg)]/50 transition-colors" />
                            <span className="font-medium">{item.label}</span>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-2 h-2 bg-[var(--fg)]/30 rounded-full" />
                            </div>
                          </Link>
                        ))}
                        
                        {/* Sign Out */}
                        <div className="group flex items-center px-4 py-3 rounded-2xl text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 hover:shadow-md cursor-pointer">
                          <div className="w-2 h-2 rounded-full mr-3 bg-red-500/50 group-hover:bg-red-500 transition-colors" />
                          <span className="font-medium">Sign out</span>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 bg-red-500/50 rounded-full" />
                          </div>
                        </div>
                      </nav>
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
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
              <Button variant="ghost" size="sm" className="md:hidden p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[var(--bg)]/95 backdrop-blur-xl border-l border-[var(--border)]/60">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]/40">
                  <h3 className="font-heading text-xl font-bold text-[var(--fg)]">Menu</h3>
                  <ThemeToggle />
                </div>
                
                {/* Navigation */}
                <div className="flex-1 py-6">
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive(item.href)
                            ? "bg-brand/10 text-brand font-semibold border border-brand/20"
                            : "text-[var(--fg)]/80 hover:bg-muted/50 hover:text-[var(--fg)]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* User Section */}
                {isLoggedIn ? (
                  <div className="border-t border-[var(--border)]/40 pt-6 space-y-4">
                    <div className="flex items-center space-x-3 px-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userAvatarUrl} alt={userName} />
                        <AvatarFallback className="bg-brand/10 text-brand">
                          {userName ? userName.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[var(--fg)]">{userName || "User"}</p>
                        <p className="text-sm text-[var(--fg)]/60">Account</p>
                      </div>
                    </div>
                    <nav className="space-y-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-3 rounded-xl text-[var(--fg)]/80 hover:bg-muted/50 hover:text-[var(--fg)] transition-all duration-200"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="px-4 py-3 text-[var(--fg)]/60 hover:text-[var(--fg)]/80 transition-colors cursor-pointer">
                        Sign out
                      </div>
                    </nav>
                  </div>
                ) : (
                  <div className="border-t border-[var(--border)]/40 pt-6 space-y-4">
                    <div className="px-4 space-y-3">
                      <Button className="w-full bg-gradient-to-r from-brand to-purple-600 text-white hover:opacity-90 transition-opacity" asChild>
                        <Link href="/auth">Get Started</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/auth/sign-in">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 
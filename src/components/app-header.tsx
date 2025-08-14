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
							<header className="sticky top-0 z-50 w-full border-b border-[var(--border)]/60 bg-[var(--bg)]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg)]/50">
	      <div className="container flex h-16 items-center">
	        {/* Left: Brand */}
	        <div className="mr-4 flex items-center">
	          <Link href="/" className="mr-6 flex items-center space-x-2">
	            <span className="font-heading text-xl font-bold bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">LearnovAI</span>
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
	        <div className="flex flex-1 items-center justify-end gap-2">
	          <ThemeToggle />
	          {!isLoggedIn ? (
	            <>
	              <Button variant="ghost" size="sm" asChild>
	                <Link href="/auth/sign-in">Sign In</Link>
	              </Button>
	              <Button size="sm" asChild className="bg-gradient-to-r from-brand to-purple-600 hover:opacity-95 text-white border-0 shadow-md">
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
	              <Button variant="ghost" size="sm" className="md:hidden">
	                <Menu className="h-5 w-5" />
	                <span className="sr-only">Toggle menu</span>
	              </Button>
	            </SheetTrigger>
	            <SheetContent side="right">
	              <div className="flex flex-col space-y-4 mt-8">
	                <div className="flex items-center justify-between">
	                  <h3 className="font-heading text-lg font-semibold">Navigation</h3>
	                  <ThemeToggle />
	                </div>
	                <div className="space-y-2">
	                  <nav className="flex flex-col space-y-2">
	                    {navItems.map((item) => (
	                      <Link
	                        key={item.href}
	                        href={item.href}
	                        className={`px-3 py-2 rounded-md transition-colors ${
	                          isActive(item.href)
	                            ? "bg-brand/10 text-[var(--fg)]"
	                            : "hover:bg-muted"
	                        }`}
	                      >
	                        {item.label}
	                      </Link>
	                    ))}
	                  </nav>
	                </div>
	                {isLoggedIn && (
	                  <div className="border-t pt-4">
	                    <h3 className="font-heading text-lg font-semibold mb-2">Account</h3>
	                    <nav className="flex flex-col space-y-2">
	                      {userMenuItems.map((item) => (
	                        <Link
	                          key={item.href}
	                          href={item.href}
	                          className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
	                        >
	                          {item.label}
	                        </Link>
	                      ))}
	                      <div className="px-3 py-2 text-[var(--muted)]">Sign out</div>
	                    </nav>
	                  </div>
	                )}
	                {!isLoggedIn && (
	                  <div className="pt-2">
	                    <Button className="w-full bg-gradient-to-r from-brand to-purple-600 text-white" asChild>
	                      <Link href="/auth">Get Started</Link>
	                    </Button>
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
"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPortal } from "react-dom";
import { 
  Home, 
  Target, 
  History, 
  Plus, 
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Brain,
  BookCheck,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useIsAdmin } from "@/app/lib/hooks";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedHamburger } from "@/components/ui/animated-hamburger";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until we're mounted on the client
  if (!isMounted) {
    return (
      <div className="min-h-screen relative bg-[var(--bg)]">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.08),transparent),radial-gradient(800px_400px_at_100%_20%,rgba(147,51,234,0.08),transparent)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-[0.06]" style={{backgroundImage:"linear-gradient(to_right,rgba(0,0,0,.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.6)_1px,transparent_1px)",backgroundSize:"56px_56px"}} />
      </div>
      <div className="relative flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
          <div className="flex flex-col flex-grow bg-[var(--card)]/80 backdrop-blur border-r border-[var(--border)]/60 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center space-x-3 px-4">
              <Logo size="md" />
              <h1 className="font-heading text-xl font-semibold gradient-text">Learnovium</h1>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              <AppNav />
            </nav>
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl p-3">
                <AnimatedHamburger isOpen={false} className="text-[var(--fg)]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-l border-white/20 dark:border-slate-700/50 top-16 h-[calc(100vh-4rem)]">
              <div className="flex flex-col h-full overflow-hidden">
                {/* Modern Mobile Header */}
                <div className="relative overflow-hidden bg-gradient-fresh p-6 text-white shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Logo size="lg" />
                    <span className="font-heading text-xl font-semibold">Learnovium</span>
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/40 to-white/20 dark:from-slate-800/40 dark:to-slate-800/20">
                  {/* Modern Mobile Navigation */}
                  <nav className="p-6 space-y-3">
                    <MobileAppNav />
                  </nav>

                  {/* Modern Mobile Footer - User Info */}
                  <div className="p-6 border-t border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30">
                    <MobileUserMenu />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Topbar */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-[var(--border)]/60 bg-[var(--bg)]/70 backdrop-blur-xl px-4 shadow-sm sm:px-6 lg:px-8">
            {/* Mobile: Centered logo with user menu, Desktop: Left-aligned with right user menu */}
            <div className="flex w-full items-center">
              {/* Mobile Layout */}
              <div className="flex lg:hidden w-full items-center relative">
                {/* Mobile Logo - Absolutely centered */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-3">
                    <Logo size="md" />
                    <span className="font-heading text-lg font-semibold gradient-text">Learnovium</span>
                  </div>
                </div>
                
                {/* Mobile User Menu - Right aligned */}
                <div className="flex items-center ml-auto">
                  <UserMenu />
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden lg:flex w-full items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Logo size="md" />
                  <span className="font-heading text-lg font-semibold gradient-text">Learnovium</span>
                </div>
                
                {/* Desktop User Menu - Right aligned */}
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AppNav() {
  const pathname = usePathname();
  const { isAdmin, loading, error } = useIsAdmin();
  
  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home },
    { name: "Plans", href: "/app/plans", icon: Target },
    { name: "Quiz", href: "/app/quiz", icon: BookCheck },
    { name: "Flashcards", href: "/app/flashcards", icon: Brain },
    { name: "History", href: "/app/history", icon: History },
    { name: "Create", href: "/app/create", icon: Plus },
    { name: "Recommendations", href: "/app/recommendations", icon: Lightbulb },
  ];

  // Add admin link if user is admin and no database errors
  if (isAdmin && !loading && !error) {
    navigation.push({ name: "Admin", href: "/app/admin/metrics", icon: Shield });
  }

  // Safety check: ensure navigation is always an array
  if (!Array.isArray(navigation)) {
    console.warn("Navigation is not an array:", navigation);
    return (
      <div className="px-4 py-3 text-sm text-red-600">
        Navigation error
      </div>
    );
  }

  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href === "/app/admin/metrics" && pathname.startsWith("/app/admin"));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "text-[var(--fg,_#101010)]/70 hover:text-[var(--fg,_#101010)] hover:bg-[var(--muted)]/50 hover:scale-[1.02]"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                isActive ? "text-white" : "text-[var(--fg,_#101010)]/60 group-hover:scale-110"
              }`}
            />
            {item.name}
          </Link>
        );
      })}
    </>
  );
}

function MobileAppNav() {
  const pathname = usePathname();
  const { isAdmin, loading, error } = useIsAdmin();
  
  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home, description: "Overview and progress" },
    { name: "Plans", href: "/app/plans", icon: Target, description: "Your learning plans" },
    { name: "Quiz", href: "/app/quiz", icon: BookCheck, description: "Test your knowledge" },
    { name: "Flashcards", href: "/app/flashcards", icon: Brain, description: "Study with flashcards" },
    { name: "History", href: "/app/history", icon: History, description: "Past activities" },
    { name: "Create", href: "/app/create", icon: Plus, description: "Start something new" },
    { name: "Recommendations", href: "/app/recommendations", icon: Lightbulb, description: "AI-powered suggestions" },
  ];

  // Add admin link if user is admin and no database errors
  if (isAdmin && !loading && !error) {
    navigation.push({ name: "Admin", href: "/app/admin/metrics", icon: Shield, description: "System administration" });
  }

  // Safety check: ensure navigation is always an array
  if (!Array.isArray(navigation)) {
    console.warn("Mobile navigation is not an array:", navigation);
    return (
      <div className="p-4 text-sm text-red-600">
        Navigation error
      </div>
    );
  }

  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href === "/app/admin/metrics" && pathname.startsWith("/app/admin"));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group block p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 shadow-lg shadow-blue-500/10"
                : "bg-white/40 dark:bg-slate-700/40 border border-white/20 dark:border-slate-600/30 hover:bg-white/60 dark:hover:bg-slate-600/40 hover:shadow-lg hover:shadow-black/5"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25" 
                  : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-blue-900/20 dark:group-hover:to-purple-900/20"
              }`}>
                <item.icon className={`h-6 w-6 ${
                  isActive ? "text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }`} />
              </div>
              <div className="flex-1">
                <div className={`font-semibold text-base ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-100"
                }`}>
                  {item.name}
                </div>
                <div className={`text-sm ${
                  isActive ? "text-blue-500 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"
                }`}>
                  Navigate to {item.description}
                </div>
              </div>
              <div className={`text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors ${
                isActive ? "text-blue-400" : ""
              }`}>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [user, setUser] = useState<{ id?: string; email?: string; user_metadata?: { avatar_url?: string } } | null>(null);
  const [profile, setProfile] = useState<{ avatar_url?: string; name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Fetch profile data if user exists
        if (user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("avatar_url, name")
              .eq("id", user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              // Set empty profile to avoid repeated requests
              setProfile({ avatar_url: undefined, name: undefined });
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Profile fetch failed:", error);
            // Set empty profile to avoid repeated requests
            setProfile({ avatar_url: undefined, name: undefined });
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUser();

    // Listen for profile updates
    const supabase = supabaseBrowser();
    const channel = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        (payload: { new: { id: string; avatar_url?: string; name?: string } }) => {
          if (user && payload.new.id === user.id) {
            setProfile(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/auth");
    }
  };

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      console.log("Dashboard: Toggling user menu from:", isOpen, "to:", !isOpen);
      const rect = event.currentTarget.getBoundingClientRect();
      setButtonRect(rect);
      setIsOpen(prev => !prev);
    } catch (error) {
      console.error("Error toggling menu:", error);
    }
  };

  console.log("UserMenu render - isOpen:", isOpen);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="group relative h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        onClick={toggleMenu}
      >
        <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 pointer-events-none">
          <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={user?.email} />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        
        {/* Animated indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full border-2 border-white transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-60'
        }`} />
      </Button>

      {isOpen && buttonRect && typeof window !== 'undefined' && createPortal(
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modern Dropdown Menu */}
          <div 
            className="fixed z-[110] w-80 sm:w-80"
            style={{
              top: buttonRect.bottom + 8,
              left: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : Math.max(8, Math.min(buttonRect.right - 320, (typeof window !== 'undefined' ? window.innerWidth : 1024) - 328)),
              right: typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 'auto',
              width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'auto' : '320px',
            }}
          >
            <div className="relative">
              {/* Arrow pointer */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-l border-t border-gray-200/50 dark:border-slate-700/50" />
              
              {/* Main menu container */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/20 border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
                {/* Header with gradient */}
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-white/10 opacity-30" />
                  
                  <div className="relative flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-4 ring-white/30 shadow-lg">
                        <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={user?.email} />
                        <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-sm">
                          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-white shadow-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{user?.email || "User Account"}</h3>
                      <p className="text-indigo-100 text-sm truncate">{user?.email || "user@example.com"}</p>
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
                  <Link href="/app" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-indigo-800/30 transition-all duration-200 mr-3">
                      <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Dashboard</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">View your progress</div>
                    </div>
                    <div className="text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <Link href="/app/plans" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 group-hover:from-purple-100 group-hover:to-pink-200 dark:group-hover:from-purple-800/30 dark:group-hover:to-pink-800/30 transition-all duration-200 mr-3">
                      <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Plans</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">Manage your plans</div>
                    </div>
                    <div className="text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <Link href="/app/stats" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 group-hover:from-emerald-100 group-hover:to-teal-200 dark:group-hover:from-emerald-800/30 dark:group-hover:to-teal-800/30 transition-all duration-200 mr-3">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Stats & Streaks</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">View your progress analytics</div>
                    </div>
                    <div className="text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <Link href="/app/settings" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 group-hover:from-orange-100 group-hover:to-red-200 dark:group-hover:from-orange-800/30 dark:group-hover:to-red-800/30 transition-all duration-200 mr-3">
                      <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Settings</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">Customize your experience</div>
                    </div>
                    <div className="text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                </div>

                {/* Footer with theme toggle and sign out */}
                <div className="p-3 border-t border-gray-100 dark:border-slate-700/50 space-y-2">
                  <div className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 transition-all duration-200">
                        <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">Theme</div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">Light / Dark mode</div>
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="group w-full flex items-center px-4 py-3 text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all duration-200 mr-3">
                      <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Sign Out</div>
                      <div className="text-xs text-red-500 dark:text-red-400">End your session</div>
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
  );
}

function MobileUserMenu() {
  const [user, setUser] = useState<{ id?: string; email?: string; user_metadata?: { avatar_url?: string } } | null>(null);
  const [profile, setProfile] = useState<{ avatar_url?: string; name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        // Fetch profile data if user exists
        if (user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("avatar_url, name")
              .eq("id", user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              // Set empty profile to avoid repeated requests
              setProfile({ avatar_url: undefined, name: undefined });
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Profile fetch failed:", error);
            // Set empty profile to avoid repeated requests
            setProfile({ avatar_url: undefined, name: undefined });
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      router.push("/auth");
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhanced User Info */}
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-700/60 border border-white/20 dark:border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
        <Avatar className="h-12 w-12 ring-2 ring-white/20 dark:ring-slate-600/30">
          <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt={user?.email} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
            {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{user?.email || "User"}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Signed In</p>
        </div>
      </div>
      
      {/* Enhanced Theme Toggle */}
      <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-700/60 rounded-2xl border border-white/20 dark:border-slate-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-indigo-800/30 transition-all duration-200">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">Theme</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Light / Dark mode</div>
          </div>
        </div>
        <ThemeToggle />
      </div>
      
      {/* Go to Dashboard */}
      <Link href="/app" className="block">
        <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-95 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] rounded-2xl py-4 text-base font-semibold text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Go to Dashboard</span>
          </div>
        </div>
      </Link>
      
      {/* Enhanced Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-300 hover:scale-[1.02] font-medium"
      >
        Sign Out
      </button>
    </div>
  );
}


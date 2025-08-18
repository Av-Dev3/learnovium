"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPortal } from "react-dom";
import { 
  Menu, 
  Home, 
  Target, 
  History, 
  Plus, 
  Settings,
  LogOut,
  User,
  HelpCircle,
  ChevronRight,
  Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useIsAdmin } from "@/app/lib/hooks";
import { Logo } from "@/components/Logo";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative bg-[var(--bg)]">
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
                <Menu className="h-5 w-5 text-[var(--fg)]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-[var(--card)]/95 backdrop-blur-xl border-r border-[var(--border)]/60">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]/60">
                  <div className="flex items-center space-x-3">
                    <Logo size="lg" />
                    <h1 className="font-heading text-xl font-semibold gradient-text">Learnovium</h1>
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <nav className="flex-1 p-6 space-y-2">
                  <MobileAppNav />
                </nav>
                
                {/* Mobile Footer */}
                <div className="p-6 border-t border-[var(--border)]/60">
                  <MobileUserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Topbar */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[var(--border)]/60 bg-[var(--bg)]/70 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              {/* Logo for mobile dashboard header - centered */}
              <div className="flex items-center justify-center flex-1 lg:hidden">
                <div className="flex items-center space-x-3">
                  <Logo size="md" />
                  <span className="font-heading text-lg font-semibold gradient-text">Learnovium</span>
                </div>
              </div>
              <div className="hidden lg:flex lg:flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <UserMenu />
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
    { name: "History", href: "/app/history", icon: History },
    { name: "Create", href: "/app/create", icon: Plus },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  // Add admin link if user is admin and no database errors
  if (isAdmin && !loading && !error) {
            navigation.push({ name: "Admin", href: "/admin/metrics", icon: Shield });
  }

  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href === "/admin/metrics" && pathname.startsWith("/admin"));
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
    { name: "History", href: "/app/history", icon: History, description: "Past activities" },
    { name: "Create", href: "/app/create", icon: Plus, description: "Start something new" },
    { name: "Settings", href: "/app/settings", icon: Settings, description: "Preferences & account" },
  ];

  // Add admin link if user is admin and no database errors
  if (isAdmin && !loading && !error) {
    navigation.push({ name: "Admin", href: "/admin/metrics", icon: Shield, description: "System administration" });
  }

  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href === "/admin/metrics" && pathname.startsWith("/admin"));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`group block p-4 rounded-2xl transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "text-[var(--fg,_#101010)]/70 hover:text-[var(--fg,_#101010)] hover:bg-[var(--muted)]/50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl transition-all duration-200 ${
                isActive ? "bg-white/20" : "bg-[var(--muted)]/50 group-hover:bg-[var(--muted)]/70"
              }`}>
                <item.icon className={`h-6 w-6 ${
                  isActive ? "text-white" : "text-[var(--fg,_#101010)]/60"
                }`} />
              </div>
              <div className="flex-1">
                <div className={`font-semibold text-base ${
                  isActive ? "text-white" : "text-[var(--fg,_#101010)]"
                }`}>
                  {item.name}
                </div>
                <div className={`text-sm ${
                  isActive ? "text-white/80" : "text-[var(--fg,_#101010)]/50"
                }`}>
                  {item.description}
                </div>
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
  const [user, setUser] = useState<{ email?: string; user_metadata?: { avatar_url?: string } } | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

  // Get user data on component mount
  useEffect(() => {
    const getUser = async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Dashboard: Toggling user menu from:", isOpen, "to:", !isOpen);
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setIsOpen(prev => !prev);
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
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
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
              left: window.innerWidth < 640 ? 8 : Math.max(8, Math.min(buttonRect.right - 320, window.innerWidth - 328)),
              right: window.innerWidth < 640 ? 8 : 'auto',
              width: window.innerWidth < 640 ? 'auto' : '320px',
            }}
          >
            <div className="relative">
              {/* Arrow pointer */}
              <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-200/50" />
              
              {/* Main menu container */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-200/50 overflow-hidden">
                {/* Header with gradient */}
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-white/10 opacity-30" />
                  
                  <div className="relative flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-4 ring-white/30 shadow-lg">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
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
                  <Link href="/app/dashboard" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-200 mr-3">
                      <Home className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Dashboard</div>
                      <div className="text-xs text-gray-500">View your progress</div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <Link href="/app/plans" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-100 group-hover:from-purple-100 group-hover:to-pink-200 transition-all duration-200 mr-3">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Plans</div>
                      <div className="text-xs text-gray-500">Manage your plans</div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <Link href="/app/plans" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 group-hover:from-emerald-100 group-hover:to-teal-200 transition-all duration-200 mr-3">
                      <Target className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Plans</div>
                      <div className="text-xs text-gray-500">Track your learning plans</div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
                  
                  <Link href="/app/settings" className="group w-full flex items-center px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-red-100 group-hover:from-orange-100 group-hover:to-red-200 transition-all duration-200 mr-3">
                      <Settings className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Settings</div>
                      <div className="text-xs text-gray-500">Customize your experience</div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Link>
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
  );
}

function MobileUserMenu() {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { avatar_url?: string } } | null>(null);

  // Get user data on component mount
  useEffect(() => {
    const getUser = async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="space-y-4">
      {/* Enhanced User Profile Card */}
      <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-white/10 opacity-30" />
        
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-4 ring-white/30 shadow-lg">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold backdrop-blur-sm">
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {/* Online status */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-3 border-white shadow-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg">{user?.email || "User Account"}</h3>
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
        <button className="group w-full flex items-center p-4 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-200 mr-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">Profile Settings</div>
            <div className="text-sm text-gray-500">Manage your account</div>
          </div>
        </button>
        
        <button className="group w-full flex items-center p-4 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-100 group-hover:from-purple-100 group-hover:to-pink-200 transition-all duration-200 mr-4">
            <Settings className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">Preferences</div>
            <div className="text-sm text-gray-500">Customize your experience</div>
          </div>
        </button>
        
        <button className="group w-full flex items-center p-4 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 group-hover:from-emerald-100 group-hover:to-teal-200 transition-all duration-200 mr-4">
            <HelpCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-base">Help & Support</div>
            <div className="text-sm text-gray-500">Get assistance</div>
          </div>
        </button>
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
  );
}


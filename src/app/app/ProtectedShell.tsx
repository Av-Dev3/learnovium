"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, 
  Home, 
  Target, 
  History, 
  Plus, 
  Settings,
  LogOut,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

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
            <div className="flex items-center space-x-2 px-4">
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
              <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50 bg-[var(--card)]/80 backdrop-blur border border-[var(--border)]/60 hover:bg-[var(--card)]/90">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-[var(--card)]/95 backdrop-blur-xl border-r border-[var(--border)]/60">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <h1 className="font-heading text-xl font-semibold">Learnovium</h1>
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
              <div className="flex flex-1"></div>
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
  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home },
    { name: "Plans", href: "/app/plans", icon: Target },
    { name: "History", href: "/app/history", icon: History },
    { name: "Create", href: "/app/create", icon: Plus },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];
  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
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
  const navigation = [
    { name: "Dashboard", href: "/app", icon: Home, description: "Overview and progress" },
    { name: "Plans", href: "/app/plans", icon: Target, description: "Your learning plans" },
    { name: "History", href: "/app/history", icon: History, description: "Past activities" },
    { name: "Create", href: "/app/create", icon: Plus, description: "Start something new" },
    { name: "Settings", href: "/app/settings", icon: Settings, description: "Preferences & account" },
  ];
  return (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
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

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full bg-[var(--card)]/80 backdrop-blur border border-[var(--border)]/60 hover:bg-[var(--card)]/90 hover:scale-105 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            U
          </AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-[var(--card)]/95 backdrop-blur-xl border border-[var(--border)]/60 shadow-2xl shadow-black/10 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)]/60 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-4 border-white/20">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">User Account</h3>
                  <p className="text-sm text-[var(--fg)]/70">user@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-[var(--muted)]/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-5 w-5" />
                Profile Settings
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-[var(--muted)]/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-3 h-5 w-5" />
                Preferences
              </Button>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[var(--border)]/60">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 px-4 rounded-xl hover:bg-red-500/10 hover:text-red-600 transition-colors"
                onClick={handleSignOut}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MobileUserMenu() {
  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[var(--muted)]/30">
        <Avatar className="h-12 w-12 border-2 border-white/20">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
            U
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold text-base">User Account</div>
          <div className="text-sm text-[var(--fg)]/70">user@example.com</div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        className="w-full justify-start h-12 px-4 rounded-xl hover:bg-[var(--muted)]/50 transition-colors"
      >
        <User className="mr-3 h-5 w-5" />
        Profile Settings
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start h-12 px-4 rounded-xl hover:bg-[var(--muted)]/50 transition-colors"
      >
        <Settings className="mr-3 h-5 w-5" />
        Preferences
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start h-12 px-4 rounded-xl hover:bg-red-500/10 hover:text-red-600 transition-colors"
        onClick={handleSignOut}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Sign Out
      </Button>
    </div>
  );
}


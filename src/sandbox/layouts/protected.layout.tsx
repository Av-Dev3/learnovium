"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "sonner";
import { 
  Menu, 
  Home, 
  Target, 
  History, 
  Plus, 
  Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative bg-[var(--bg)]">
      {/* Subtle aurora/grid background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.08),transparent),radial-gradient(800px_400px_at_100%_20%,rgba(147,51,234,0.08),transparent)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-[0.06]" style={{backgroundImage:"linear-gradient(to_right,rgba(0,0,0,.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.6)_1px,transparent_1px)",backgroundSize:"56px_56px"}} />
      </div>
      <div className="relative flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
          <div className="flex flex-col flex-grow bg-[var(--card)]/80 backdrop-blur border-r border-[var(--border)]/60 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="font-heading text-xl font-semibold bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">LearnovAI</h1>
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
              <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center flex-shrink-0 px-4 py-5">
                  <h1 className="font-heading text-xl font-semibold">LearnovAI</h1>
                </div>
                <nav className="flex-1 px-2 space-y-1">
                  <AppNav />
                </nav>
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
      <Toaster />
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
            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-full transition-colors ${
              isActive
                ? "bg-brand text-white"
                : "text-[var(--fg)]/70 hover:text-[var(--fg)] hover:bg-muted"
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                isActive ? "text-white" : "text-[var(--fg)]/60"
              }`}
            />
            {item.name}
          </Link>
        );
      })}
    </>
  );
}

function UserMenu() {
  return (
    <div className="flex items-center gap-x-4">
      <span className="text-sm text-muted-foreground">Welcome back!</span>
      <Avatar className="h-8 w-8">
        <AvatarImage src="" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  );
}


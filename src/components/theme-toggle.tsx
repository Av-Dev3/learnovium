"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 px-0 hover:bg-muted/50 transition-colors"
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 transition-transform hover:scale-110" />
      ) : (
        <Sun className="h-4 w-4 transition-transform hover:scale-110" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 
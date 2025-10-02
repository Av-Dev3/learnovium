"use client";

import { cn } from "@/lib/utils";

interface AnimatedHamburgerProps {
  isOpen?: boolean;
  className?: string;
}

export function AnimatedHamburger({ isOpen = false, className }: AnimatedHamburgerProps) {
  return (
    <div className={cn("w-6 h-6 flex flex-col justify-center items-center", className)}>
      <div className="w-full flex flex-col items-center justify-center space-y-1">
        {/* Top line */}
        <div
          className={cn(
            "h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out",
            isOpen ? "w-5 rotate-45 translate-y-1.5" : "w-6"
          )}
        />
        {/* Middle line */}
        <div
          className={cn(
            "h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out",
            isOpen ? "w-0 opacity-0" : "w-5"
          )}
        />
        {/* Bottom line */}
        <div
          className={cn(
            "h-0.5 bg-current rounded-full transition-all duration-300 ease-in-out",
            isOpen ? "w-5 -rotate-45 -translate-y-1.5" : "w-6"
          )}
        />
      </div>
    </div>
  );
}

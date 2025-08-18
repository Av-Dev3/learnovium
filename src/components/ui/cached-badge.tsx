import { Badge } from "./badge";
import { Cache } from "lucide-react";

interface CachedBadgeProps {
  className?: string;
}

export function CachedBadge({ className }: CachedBadgeProps) {
  return (
    <Badge variant="secondary" className={`gap-1 ${className}`}>
      <Cache className="h-3 w-3" />
      Cached
    </Badge>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center space-x-3">
                <Logo size="md" />
                <h1 className="text-lg sm:text-xl font-semibold">Admin Panel</h1>
              </div>
              <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Link href="/app/admin">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-start">Overview</Button>
                </Link>
                <Link href="/app/admin/metrics">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-start">Metrics</Button>
                </Link>
                <Link href="/app/admin/ai-metrics">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto justify-start">AI Metrics</Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/app" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">Back to App</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}

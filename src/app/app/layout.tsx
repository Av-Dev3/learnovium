import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { ProtectedShell } from "./ProtectedShell";

export const dynamic = "force-dynamic";
export const revalidate = 0; // never cache auth state

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Check if required environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      // Return a fallback layout instead of crashing
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Error</h1>
            <p className="text-gray-600">Missing required environment variables.</p>
          </div>
        </div>
      );
    }

    // Check authentication status
    const supabase = await supabaseServer();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error checking session:", error);
      // Return a fallback layout instead of crashing
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
            <p className="text-gray-600">Unable to verify authentication status.</p>
          </div>
        </div>
      );
    }

    if (!session) {
      redirect("/auth?next=/app");
    }

    return <ProtectedShell>{children}</ProtectedShell>;
  } catch (error) {
    console.error("Critical error in AppLayout:", error);
    // Return a fallback layout instead of crashing
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
} 
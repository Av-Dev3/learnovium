import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * Server component that conditionally renders an Admin link
 * Only shows for authenticated users with is_admin = true
 */
export async function AdminLink() {
  try {
    // Get the current user session
    const supabase = await supabaseServer();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    // Check if user has admin privileges
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();

    if (error || !profile?.is_admin) {
      return null;
    }

    // Render admin link for admin users
    return (
      <Link 
        href="/admin/metrics" 
        className="text-sm font-medium"
      >
        Admin
      </Link>
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    return null;
  }
}

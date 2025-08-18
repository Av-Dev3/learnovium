import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

/**
 * Hook to check if current user is an admin
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked.current) return;
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    hasChecked.current = true;

    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = supabaseBrowser();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn("Session error:", sessionError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        if (!session?.user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();

        if (error) {
          // Handle specific database errors gracefully
          if (error.code === '42703' || error.message?.includes('does not exist')) {
            // Table/column doesn't exist - likely migration not run
            console.warn("Admin feature not available: Database migration required");
            setError("Database migration required for admin features");
          } else {
            console.error("Error checking admin status:", error);
            setError("Failed to check admin status");
          }
          setIsAdmin(false);
        } else {
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        console.error("Unexpected error in admin status check:", error);
        setError("Unexpected error checking admin status");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, loading, error };
}

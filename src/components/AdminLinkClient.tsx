"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function AdminLinkClient() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const supabase = supabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("user_id", user.id)
            .single();
          
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Link 
              href="/admin/metrics" 
      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <Shield className="h-4 w-4" />
      Admin
    </Link>
  );
}

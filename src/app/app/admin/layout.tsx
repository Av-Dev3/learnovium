import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication status
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth?next=/app/admin");
  }

  // Check admin privileges
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (error || !profile?.is_admin) {
    redirect("/app?error=admin_required");
  }

  return <>{children}</>;
}

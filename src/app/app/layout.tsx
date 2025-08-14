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
  // Check authentication status
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth?next=/app");
  }

  return <ProtectedShell>{children}</ProtectedShell>;
} 
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { ProtectedShell } from "./ProtectedShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication status
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  return <ProtectedShell>{children}</ProtectedShell>;
} 
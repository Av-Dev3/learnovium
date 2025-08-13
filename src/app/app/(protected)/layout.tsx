import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function ProtectedLayout({
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

  return <>{children}</>;
} 
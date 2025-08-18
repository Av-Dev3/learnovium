import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => cookieStore.get(n)?.value, set() {}, remove() {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");
  const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!prof?.is_admin) redirect("/app");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="Learnovium" className="w-8 h-8 rounded-xl" />
                <h1 className="text-xl font-semibold">Admin Panel</h1>
              </div>
              <nav className="flex items-center space-x-4">
                <Link href="/app/admin">
                  <Button variant="ghost" size="sm">Overview</Button>
                </Link>
                <Link href="/app/admin/metrics">
                  <Button variant="ghost" size="sm">AI Metrics</Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Logged in as: {user.email}</span>
              <Link href="/app">
                <Button variant="outline" size="sm">Back to App</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}

import { supabaseServer } from "@/lib/supabaseServer";
import ClientBlock from "./ClientBlock";

export default async function AuthDebug() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Auth Debug</h1>
      <div className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Server-side getUser()</h2>
        <pre className="text-sm overflow-auto">
{JSON.stringify({ user: data?.user ?? null, error: error?.message ?? null }, null, 2)}
        </pre>
      </div>

      <ClientBlock />
    </main>
  );
} 
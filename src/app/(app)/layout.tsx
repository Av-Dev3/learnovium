import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/layout/footer";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.08),transparent)]">
      <AppHeader isLoggedIn={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
} 
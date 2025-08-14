import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/layout/footer";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader isLoggedIn={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}


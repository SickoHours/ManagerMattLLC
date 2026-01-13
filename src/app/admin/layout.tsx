import { AdminSidebar } from "@/components/admin/sidebar";
import { ClerkAuthProvider } from "@/components/providers/convex-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkAuthProvider>
      <div className="flex h-screen bg-zinc-950">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </ClerkAuthProvider>
  );
}

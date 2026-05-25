import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/petugas/profile")({ component: Page });

function Page() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AppLayout>
      <PageHeader title="Profile" />
      <div className="bg-card border border-border rounded-2xl p-8 shadow-card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl shadow-soft">
            {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div className="font-display font-bold text-xl">{user.name}</div>
            <div className="text-sm text-muted-foreground">Transport Worker</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-muted/50 p-4"><div className="text-xs text-muted-foreground uppercase">Email</div><div className="font-medium mt-1">{user.email}</div></div>
          <div className="rounded-xl bg-muted/50 p-4"><div className="text-xs text-muted-foreground uppercase">Area</div><div className="font-medium mt-1">{user.area}</div></div>
          <div className="rounded-xl bg-muted/50 p-4"><div className="text-xs text-muted-foreground uppercase">Completed</div><div className="font-medium mt-1">142 pickups</div></div>
          <div className="rounded-xl bg-muted/50 p-4"><div className="text-xs text-muted-foreground uppercase">Rating</div><div className="font-medium mt-1">4.8 / 5</div></div>
        </div>
      </div>
    </AppLayout>
  );
}

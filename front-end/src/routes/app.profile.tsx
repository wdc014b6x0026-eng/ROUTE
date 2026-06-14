import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/profile")({ component: Page });

function Page() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AppLayout>
      <PageHeader title="Profile" description="Your account information" />
      <div className="bg-card border border-border rounded-2xl p-8 shadow-card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-16 rounded-2xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-xl shadow-soft">
            {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div className="font-display font-bold text-xl">{user.name}</div>
            <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email" value={user.email} />
          <Field label="Role" value={user.role} />
          {user.area && <Field label="Area" value={user.area} />}
          <Field label="Member since" value="May 2026" />
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 p-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="font-medium mt-1 capitalize">{value}</div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockAnnouncements } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { Pin, Megaphone } from "lucide-react";

export const Route = createFileRoute("/announcements")({ component: Page });

function Content() {
  return (
    <>
      <PageHeader title="Announcements" description="Schedule changes, policy updates, and notices" />
      <div className="space-y-4">
        {mockAnnouncements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-soft transition">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Megaphone className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-lg">{a.title}</h3>
                  {a.pinned && <span className="text-xs px-2 py-0.5 rounded bg-warning/15 text-warning font-medium flex items-center gap-1"><Pin className="size-3" />Pinned</span>}
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{a.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{a.body}</p>
                <div className="text-xs text-muted-foreground mt-3">{a.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Page() {
  const { user } = useAuth();
  if (user) return <AppLayout><Content /></AppLayout>;
  return <div className="min-h-screen bg-background p-4 lg:p-8 max-w-5xl mx-auto"><Content /></div>;
}

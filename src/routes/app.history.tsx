import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { mockHistory } from "@/lib/mock-data";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/app/history")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="History" description="All your pickups and requests" />
      <div className="bg-card border border-border rounded-2xl shadow-card">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h2 className="font-semibold">Activity Timeline</h2>
        </div>
        <div className="divide-y divide-border">
          {mockHistory.map(h => (
            <div key={h.id} className="p-5 flex items-center gap-4 hover:bg-muted/30 transition">
              <div className="text-xs text-muted-foreground w-24 shrink-0">{h.date}</div>
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                {h.type[0]}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{h.description}</div>
                <div className="text-xs text-muted-foreground">{h.type}</div>
              </div>
              <StatusBadge status={h.status.split(":")[0]} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

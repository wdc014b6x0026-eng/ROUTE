import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { mockTodayJobs } from "@/lib/mock-data";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/petugas/jadwal-hari-ini")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Today's Schedule" description="Your assigned pickups for today" />
      <div className="grid md:grid-cols-2 gap-4">
        {mockTodayJobs.map(j => (
          <div key={j.id} className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-soft transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">{j.time}</div>
                <div className="font-display font-bold text-lg mt-1">{j.resident}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="size-3.5" />{j.address}</div>
              </div>
              <StatusBadge status={j.status} />
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">{j.notes}</div>
            <div className="mt-4 flex gap-2">
              <Link to="/petugas/status" className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center justify-center">Update status</Link>
              <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium hover:bg-muted transition">Mark completed</button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

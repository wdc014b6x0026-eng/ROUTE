import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatCard, StatusBadge } from "@/components/app-layout";
import { mockTodayJobs } from "@/lib/mock-data";
import { ListChecks, ClipboardList, CheckCircle2, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/petugas/dashboard")({ component: Page });

function Page() {
  const completed = mockTodayJobs.filter(j => j.status === "picked_up").length;
  return (
    <AppLayout>
      <PageHeader title="Transporter Dashboard" description="Today's assignments and quick actions" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Jobs" value={mockTodayJobs.length} icon={ListChecks} accent="primary" />
        <StatCard label="Pending Requests" value="3" icon={ClipboardList} accent="warning" />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="success" hint="So far today" />
        <StatCard label="Assigned Area" value="Zone A" icon={MapPin} accent="info" hint="Ubud" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Today's Route</h2>
            <Link to="/petugas/jadwal-hari-ini" className="text-sm text-primary hover:underline flex items-center gap-1">All jobs <ArrowRight className="size-3" /></Link>
          </div>
          <div className="space-y-3">
            {mockTodayJobs.map(j => (
              <div key={j.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition">
                <div className="text-xs font-medium text-muted-foreground w-12">{j.time}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{j.resident}</div>
                  <div className="text-xs text-muted-foreground">{j.address}</div>
                </div>
                <StatusBadge status={j.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-6 shadow-soft">
            <h3 className="font-display font-bold text-lg">Quick action</h3>
            <p className="text-sm opacity-90 mt-1">Update the next job's status</p>
            <Link to="/petugas/status" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background text-primary text-sm font-medium hover:opacity-90 transition">
              Open updater <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold mb-3">Performance</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Completion rate</span><span className="font-medium">97%</span></div>
                <div className="h-2 bg-muted rounded-full"><div className="h-full bg-success rounded-full" style={{width:"97%"}}/></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>On-time arrival</span><span className="font-medium">89%</span></div>
                <div className="h-2 bg-muted rounded-full"><div className="h-full bg-info rounded-full" style={{width:"89%"}}/></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

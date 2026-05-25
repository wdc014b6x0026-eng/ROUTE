import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatCard, StatusBadge } from "@/components/app-layout";
import { mockSchedule, mockAnnouncements } from "@/lib/mock-data";
import { Calendar, Truck, PlusCircle, Leaf, ArrowRight, Recycle } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({ component: Page });

function Page() {
  const next = mockSchedule.find(s => s.status === "scheduled") ?? mockSchedule[0];
  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Your waste coordination at a glance" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Next Pickup" value={next.day} icon={Calendar} accent="primary" hint={`${next.time} • ${next.type}`} />
        <StatCard label="Pickup Status" value="On the way" icon={Truck} accent="info" hint="ETA ~12 min" />
        <StatCard label="This Month" value="14" icon={Recycle} accent="success" hint="Successful pickups" />
        <StatCard label="Pending Requests" value="1" icon={PlusCircle} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Upcoming Schedule</h2>
            <Link to="/app/schedule" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </div>
          <div className="space-y-3">
            {mockSchedule.map(s => (
              <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center text-center">
                  <div className="text-[10px] font-medium uppercase">{s.day.slice(0,3)}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{s.type} waste</div>
                  <div className="text-xs text-muted-foreground">{s.date} • {s.time}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-6 shadow-soft">
            <Leaf className="size-7 mb-3 opacity-80" />
            <h3 className="font-display font-bold text-lg">Need extra pickup?</h3>
            <p className="text-sm opacity-90 mt-1">Submit a request in 30 seconds.</p>
            <Link to="/app/request" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background text-primary text-sm font-medium hover:opacity-90 transition">
              Request now <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold mb-3">Latest News</h3>
            <div className="space-y-3">
              {mockAnnouncements.slice(0,2).map(a => (
                <div key={a.id} className="text-sm">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{a.date} • {a.category}</div>
                </div>
              ))}
            </div>
            <Link to="/announcements" className="mt-3 inline-block text-xs text-primary hover:underline">All announcements →</Link>
          </div>

          <div className="bg-success/10 border border-success/30 rounded-2xl p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-success">Tip of the day</div>
            <p className="text-sm mt-2">Coffee grounds make excellent compost. Add them to your organic bin instead of the trash!</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

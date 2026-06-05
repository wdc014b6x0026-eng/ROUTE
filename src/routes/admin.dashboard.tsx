import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatCard } from "@/components/app-layout";
import { pickupTrend, requestTrend } from "@/lib/mock-data";
import { Users, Truck, Calendar, ClipboardList, AlertTriangle, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Admin Dashboard" description="System overview and key metrics" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Users" value="12,438" icon={Users} accent="primary" hint="+128 this week" />
        <StatCard label="Active Transporters" value="340" icon={Truck} accent="info" />
        <StatCard label="Today's Pickups" value="294" icon={Calendar} accent="success" />
        <StatCard label="Pending Requests" value="47" icon={ClipboardList} accent="warning" />
        <StatCard label="Failed Pickups" value="18" icon={AlertTriangle} accent="destructive" hint="This week" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="font-display font-bold text-lg mb-4">Pickup Completion Rate</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pickupTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 150)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.02 160)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 160)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 150)" }} />
                <Bar dataKey="completed" fill="oklch(0.65 0.16 150)" radius={[8,8,0,0]} />
                <Bar dataKey="failed" fill="oklch(0.6 0.22 25)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="font-display font-bold text-lg mb-4">Request Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={requestTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 150)" />
                <XAxis dataKey="week" stroke="oklch(0.5 0.02 160)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 160)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 150)" }} />
                <Line type="monotone" dataKey="requests" stroke="oklch(0.58 0.14 155)" strokeWidth={3} dot={{ r: 5, fill: "oklch(0.58 0.14 155)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2"><Activity className="size-4 text-primary" />Recent Activity</h2>
          <div className="space-y-3">
            {[
              { t: "2 min ago", msg: "New pickup request from Made Ayu", c: "bg-info" },
              { t: "8 min ago", msg: "Transporter Wayan completed pickup at Jl. Hanoman", c: "bg-success" },
              { t: "22 min ago", msg: "Pickup failed: waste not sorted (Jl. Tegallalang)", c: "bg-destructive" },
              { t: "1 h ago", msg: "Komang Aris (Transporter) account approved", c: "bg-info" },
              { t: "3 h ago", msg: "New announcement published: Schedule Change", c: "bg-primary" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className={`size-2 rounded-full mt-1.5 shrink-0 ${a.c}`} />
                <div className="flex-1">{a.msg}</div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{a.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="font-display font-bold text-lg mb-4">System Status</h2>
          <div className="space-y-3">
            {[
              { n: "API", s: "Operational", cls: "bg-success/15 text-success" },
              { n: "Database", s: "Operational", cls: "bg-success/15 text-success" },
              { n: "Notifications", s: "Operational", cls: "bg-success/15 text-success" },
              { n: "Maps Service", s: "Degraded", cls: "bg-warning/15 text-warning" },
            ].map((x) => (
              <div key={x.n} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <span className="font-medium text-sm">{x.n}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${x.cls}`}>{x.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

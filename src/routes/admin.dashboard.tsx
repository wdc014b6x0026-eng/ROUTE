import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatCard } from "@/components/app-layout";
import { pickupTrend, requestTrend } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { apiFetch, type ApiUser, type ApiRequest, type ApiJadwalHarian } from "@/lib/api";
import { Users, Truck, Calendar, ClipboardList, AlertTriangle, Activity, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export const Route = createFileRoute("/admin/dashboard")({ component: Page });

function Page() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [todayJobs, setTodayJobs] = useState<ApiJadwalHarian[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      apiFetch<ApiUser[]>("/users").catch(() => [] as ApiUser[]),
      apiFetch<ApiRequest[]>("/request").catch(() => [] as ApiRequest[]),
      apiFetch<ApiJadwalHarian[]>(`/jadwal-harian/tanggal/${today}`).catch(() => [] as ApiJadwalHarian[]),
    ]).then(([u, r, j]) => {
      setUsers(u);
      setRequests(r);
      setTodayJobs(j);
    }).finally(() => setLoading(false));
  }, []);

  const transporters = users.filter(u => u.role === "petugas");
  const pendingRequests = requests.filter(r => r.status === "menunggu");
  const completedToday = todayJobs.filter(j => j.status === "sudah_diambil");
  const failedToday = todayJobs.filter(j => j.status === "dibatalkan");

  // Recent activity derived from requests
  const recentActivity = requests.slice(0, 5).map(r => ({
    t: new Date(r.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    msg: `Request: ${r.jenis_sampah} (${r.estimasi_jumlah}) — ${r.users?.nama ?? "Unknown"}`,
    c: r.status === "menunggu" ? "bg-warning" : r.status === "selesai" ? "bg-success" : "bg-info",
  }));

  return (
    <AppLayout>
      <PageHeader title="Admin Dashboard" description="System overview and key metrics" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard label="Total Users" value={users.length} icon={Users} accent="primary" />
            <StatCard label="Active Transporters" value={transporters.length} icon={Truck} accent="info" />
            <StatCard label="Today's Pickups" value={todayJobs.length} icon={Calendar} accent="success" />
            <StatCard label="Pending Requests" value={pendingRequests.length} icon={ClipboardList} accent="warning" />
            <StatCard label="Failed Today" value={failedToday.length} icon={AlertTriangle} accent="destructive" />
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
              <h2 className="font-display font-bold text-lg mb-4">Pickup Completion Rate (this week)</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pickupTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.012 150)" />
                    <XAxis dataKey="day" stroke="oklch(0.5 0.02 160)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0.02 160)" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.012 150)" }} />
                    <Bar dataKey="completed" fill="oklch(0.65 0.16 150)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="failed" fill="oklch(0.6 0.22 25)" radius={[8, 8, 0, 0]} />
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
                    <Line type="monotone" dataKey="requests" stroke="oklch(0.58 0.14 155)" strokeWidth={3}
                      dot={{ r: 5, fill: "oklch(0.58 0.14 155)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Activity className="size-4 text-primary" />Recent Requests
              </h2>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={`size-2 rounded-full mt-1.5 shrink-0 ${a.c}`} />
                      <div className="flex-1">{a.msg}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{a.t}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h2 className="font-display font-bold text-lg mb-4">Request Status Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: "Pending", value: requests.filter(r => r.status === "menunggu").length, cls: "bg-warning/15 text-warning" },
                  { label: "Accepted", value: requests.filter(r => r.status === "diterima").length, cls: "bg-info/15 text-info" },
                  { label: "Scheduled", value: requests.filter(r => r.status === "dijadwalkan").length, cls: "bg-primary/15 text-primary" },
                  { label: "Completed", value: requests.filter(r => r.status === "selesai").length, cls: "bg-success/15 text-success" },
                  { label: "Rejected", value: requests.filter(r => r.status === "ditolak").length, cls: "bg-destructive/15 text-destructive" },
                ].map(x => (
                  <div key={x.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                    <span className="font-medium text-sm">{x.label}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${x.cls}`}>{x.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}

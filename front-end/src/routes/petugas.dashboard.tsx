import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatCard, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { ListChecks, ClipboardList, CheckCircle2, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { apiFetch, fromApiStatus, type ApiJadwalHarian, type ApiRequest } from "@/lib/api";

export const Route = createFileRoute("/petugas/dashboard")({ component: Page });

function Page() {
  const [jobs, setJobs] = useState<ApiJadwalHarian[]>([]);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    Promise.all([
      apiFetch<ApiJadwalHarian[]>(`/jadwal-harian/tanggal/${today}`).catch(() => [] as ApiJadwalHarian[]),
      apiFetch<ApiRequest[]>("/request").catch(() => [] as ApiRequest[]),
    ]).then(([j, r]) => {
      setJobs(j);
      setRequests(r);
    }).finally(() => setLoading(false));
  }, []);

  const completed = jobs.filter(j => j.status === "sudah_diambil").length;
  const pendingRequests = requests.filter(r => r.status === "menunggu").length;
  const area = jobs[0]?.jadwal_tetap?.wilayah?.nama_wilayah ?? "—";

  return (
    <AppLayout>
      <PageHeader title="Transporter Dashboard" description="Today's assignments and quick actions" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Today's Jobs" value={jobs.length} icon={ListChecks} accent="primary" />
            <StatCard label="Pending Requests" value={pendingRequests} icon={ClipboardList} accent="warning" />
            <StatCard label="Completed" value={completed} icon={CheckCircle2} accent="success" hint="So far today" />
            <StatCard label="Assigned Area" value={area} icon={MapPin} accent="info" />
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">Today's Route</h2>
                <Link to="/petugas/jadwal-hari-ini" className="text-sm text-primary hover:underline flex items-center gap-1">
                  All jobs <ArrowRight className="size-3" />
                </Link>
              </div>
              {jobs.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No pickups scheduled for today.</div>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map(j => (
                    <div key={j.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition">
                      <div className="text-xs font-medium text-muted-foreground w-16">
                        {j.jadwal_tetap?.jam_mulai?.slice(0, 5) ?? "—"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {j.jadwal_tetap?.wilayah?.nama_wilayah ?? "Pickup"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {j.jadwal_tetap?.wilayah?.kecamatan}, {j.jadwal_tetap?.wilayah?.kota}
                        </div>
                      </div>
                      <StatusBadge status={fromApiStatus(j.status)} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-6 shadow-soft">
                <h3 className="font-display font-bold text-lg">Quick action</h3>
                <p className="text-sm opacity-90 mt-1">Update the next job's status</p>
                <Link to="/petugas/status"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background text-primary text-sm font-medium hover:opacity-90 transition">
                  Open updater <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold mb-3">Today's Summary</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion rate</span>
                      <span className="font-medium">{jobs.length ? Math.round((completed / jobs.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className="h-full bg-success rounded-full"
                        style={{ width: `${jobs.length ? (completed / jobs.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="rounded-lg bg-success/10 p-3 text-center">
                      <div className="text-2xl font-bold text-success">{completed}</div>
                      <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 text-center">
                      <div className="text-2xl font-bold">{jobs.length - completed}</div>
                      <div className="text-xs text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}

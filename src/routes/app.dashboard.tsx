import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatCard, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { Calendar, Truck, PlusCircle, Leaf, ArrowRight, Recycle, Loader2 } from "lucide-react";
import { apiFetch, fromApiRequestStatus, fromApiStatus, type ApiJadwalTetap, type ApiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// Inline type for announcements from API
interface ApiPengumuman {
  id: string; judul: string; isi: string; tipe: string;
  is_active: boolean; created_at: string;
}

export const Route = createFileRoute("/app/dashboard")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ApiJadwalTetap[]>([]);
  const [announcements, setAnnouncements] = useState<ApiPengumuman[]>([]);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ann, req] = await Promise.all([
          apiFetch<ApiPengumuman[]>("/pengumuman/active").catch(() => [] as ApiPengumuman[]),
          apiFetch<ApiRequest[]>("/request/my").catch(() => [] as ApiRequest[]),
        ]);
        setAnnouncements(ann);
        setRequests(req);

        if (user?.wilayah_id) {
          const sch = await apiFetch<ApiJadwalTetap[]>(`/jadwal-tetap/wilayah/${user.wilayah_id}`)
            .catch(() => [] as ApiJadwalTetap[]);
          setSchedules(sch);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user?.wilayah_id]);

  const DAY_MAP: Record<string, string> = {
    senin: "Monday", selasa: "Tuesday", rabu: "Wednesday", kamis: "Thursday",
    jumat: "Friday", sabtu: "Saturday", minggu: "Sunday",
  };

  const pendingCount = requests.filter(r => r.status === "menunggu").length;
  const nextSchedule = schedules[0];

  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Your waste coordination at a glance" />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Next Pickup"
              value={nextSchedule ? DAY_MAP[nextSchedule.hari?.toLowerCase()] ?? nextSchedule.hari : "—"}
              icon={Calendar} accent="primary"
              hint={nextSchedule ? `${nextSchedule.jam_mulai?.slice(0, 5)}` : "No schedule yet"}
            />
            <StatCard label="Pickup Status" value="Scheduled" icon={Truck} accent="info" />
            <StatCard label="Total Requests" value={requests.length} icon={Recycle} accent="success" hint="All time" />
            <StatCard label="Pending Requests" value={pendingCount} icon={PlusCircle} accent="warning" />
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg">Upcoming Schedule</h2>
                <Link to="/app/schedule" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="size-3" />
                </Link>
              </div>
              {schedules.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No schedule found for your area.{" "}
                  {!user?.wilayah_id && "Ask your admin to assign you to a wilayah."}
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map(s => (
                    <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition">
                      <div className="size-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] font-medium uppercase">
                          {DAY_MAP[s.hari?.toLowerCase()]?.slice(0, 3) ?? s.hari?.slice(0, 3)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{s.wilayah?.nama_wilayah ?? "Pickup"}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.jam_mulai?.slice(0, 5)} – {s.jam_selesai?.slice(0, 5)}
                          {s.users ? ` • ${s.users.nama}` : ""}
                        </div>
                      </div>
                      <StatusBadge status={s.is_active ? "Active" : "Inactive"} />
                    </div>
                  ))}
                </div>
              )}
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
                {announcements.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No announcements yet.</p>
                ) : (
                  <div className="space-y-3">
                    {announcements.slice(0, 2).map(a => (
                      <div key={a.id} className="text-sm">
                        <div className="font-medium">{a.judul}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(a.created_at).toLocaleDateString("id-ID")} • {a.tipe}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/announcements" className="mt-3 inline-block text-xs text-primary hover:underline">
                  All announcements →
                </Link>
              </div>

              <div className="bg-success/10 border border-success/30 rounded-2xl p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-success">Tip of the day</div>
                <p className="text-sm mt-2">Coffee grounds make excellent compost. Add them to your organic bin instead of the trash!</p>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}

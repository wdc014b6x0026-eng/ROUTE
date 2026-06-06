import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { apiFetch, fromApiStatus, type ApiJadwalHarian } from "@/lib/api";

export const Route = createFileRoute("/petugas/jadwal-hari-ini")({ component: Page });

function Page() {
  const [jobs, setJobs] = useState<ApiJadwalHarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    apiFetch<ApiJadwalHarian[]>(`/jadwal-harian/tanggal/${today}`)
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="flex items-center justify-center h-64"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div></AppLayout>;

  return (
    <AppLayout>
      <PageHeader title="Today's Schedule" description={`Assigned pickups for ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}`} />
      {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      {!error && jobs.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-card">No pickups scheduled for today.</div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map(j => (
          <div key={j.id} className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-soft transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  {j.jadwal_tetap?.jam_mulai?.slice(0, 5)} – {j.jadwal_tetap?.jam_selesai?.slice(0, 5)}
                </div>
                <div className="font-display font-bold text-lg mt-1">
                  {j.jadwal_tetap?.wilayah?.nama_wilayah ?? "Pickup"}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3.5" />
                  {j.jadwal_tetap?.wilayah?.kecamatan}, {j.jadwal_tetap?.wilayah?.kota}
                </div>
              </div>
              <StatusBadge status={fromApiStatus(j.status)} />
            </div>
            {j.catatan && <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">{j.catatan}</div>}
            <div className="mt-4 flex gap-2">
              <Link to="/petugas/status" state={{ jobId: j.id, currentStatus: j.status }}
                className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center justify-center">
                Update status
              </Link>
              <button className="flex-1 h-9 rounded-lg border border-border text-sm font-medium hover:bg-muted transition">Mark completed</button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

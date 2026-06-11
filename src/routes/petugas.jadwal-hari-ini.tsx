import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState, useCallback } from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";
import { apiFetch, fromApiStatus, type ApiJadwalHarian } from "@/lib/api";

export const Route = createFileRoute("/petugas/jadwal-hari-ini")({
  validateSearch: (search: Record<string, unknown>) => ({
    t: (search.t as number) ?? 0,
  }),
  component: Page,
});

function Page() {
  const [jobs, setJobs] = useState<ApiJadwalHarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = Route.useSearch();

  const fetchJobs = useCallback(() => {
    setLoading(true);
    setError("");
    apiFetch<ApiJadwalHarian[]>(`/jadwal-harian/petugas/jadwal`)
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Refetch setiap kali t berubah (navigate balik dari status page)
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, t]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <PageHeader
        title="Today's Schedule"
        description={`Assigned pickups for ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}`}
        action={
          <button
            onClick={fetchJobs}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition"
          >
            <RefreshCw className="size-4" /> Refresh
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!error && jobs.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-card">
          No pickups scheduled.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map(j => {
          // Hanya disable kalau sudah final (picked up atau dibatalkan)
          // tiba & dalam_perjalanan masih bisa diupdate
          const isDone = j.status === "sudah_diambil" || j.status === "dibatalkan";
          return (
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
                    {j.jadwal_tetap?.wilayah?.kecamatan}, {j.jadwal_tetap?.wilayah?.kota ?? ""}
                  </div>
                  <div className="mt-2">
                    <StatusBadge status={fromApiStatus(j.status)} />
                  </div>
                  {j.catatan && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      Catatan: {j.catatan}
                    </div>
                  )}
                </div>
              </div>
              <button
                disabled={isDone}
                onClick={() => navigate({
                  to: "/petugas/status",
                  search: {
                    jobId: j.id,
                    wilayah: j.jadwal_tetap?.wilayah?.nama_wilayah ?? "",
                    kecamatan: j.jadwal_tetap?.wilayah?.kecamatan ?? "",
                    jamMulai: j.jadwal_tetap?.jam_mulai?.slice(0, 5) ?? "",
                    jamSelesai: j.jadwal_tetap?.jam_selesai?.slice(0, 5) ?? "",
                  },
                })}
                className="mt-4 w-full h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isDone ? "Completed" : "Update Status"}
              </button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
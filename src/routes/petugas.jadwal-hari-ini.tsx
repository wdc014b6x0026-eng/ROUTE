import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState, useCallback } from "react";
import { MapPin, Loader2, RefreshCw, Clock } from "lucide-react";
import { apiFetch, fromApiStatus, type ApiJadwalHarian } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/petugas/jadwal-hari-ini")({
  validateSearch: (search: Record<string, unknown>) => ({
    t: (search.t as number) ?? 0,
  }),
  component: Page,
});

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const getWindowState = (jamMulai?: string, jamSelesai?: string) => {
  if (!jamMulai || !jamSelesai) return "active";
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  if (current < toMinutes(jamMulai)) return "upcoming";
  if (current >= toMinutes(jamSelesai)) return "expired";
  return "active";
};

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

  useEffect(() => { fetchJobs(); }, [fetchJobs, t]);

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
          const isFinal = j.status === "sudah_diambil" || j.status === "dibatalkan";
          const window = getWindowState(j.jadwal_tetap?.jam_mulai, j.jadwal_tetap?.jam_selesai);
          const isExpired = window === "expired";
          const isUpcoming = window === "upcoming";

          // Disable tombol jika: status final, jam belum mulai, atau jam sudah habis
          const buttonDisabled = isFinal || isExpired || isUpcoming;

          // Card transparan jika status final atau jam sudah habis
          const isDimmed = isFinal || isExpired;

          let buttonLabel = "Update Status";
          if (isFinal) buttonLabel = "Completed";
          else if (isExpired) buttonLabel = "Time's up";
          else if (isUpcoming) buttonLabel = `Starts at ${j.jadwal_tetap?.jam_mulai?.slice(0, 5)}`;

          return (
            <div
              key={j.id}
              className={cn(
                "bg-card border border-border rounded-2xl p-5 shadow-card transition",
                isDimmed ? "opacity-50" : "hover:shadow-soft"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={cn(
                    "text-xs font-medium flex items-center gap-1",
                    isExpired ? "text-destructive/70" : isUpcoming ? "text-warning" : "text-muted-foreground"
                  )}>
                    <Clock className="size-3" />
                    {j.jadwal_tetap?.jam_mulai?.slice(0, 5)} – {j.jadwal_tetap?.jam_selesai?.slice(0, 5)}
                    {isExpired && " · Expired"}
                    {isUpcoming && " · Upcoming"}
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
                disabled={buttonDisabled}
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
                {buttonLabel}
              </button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
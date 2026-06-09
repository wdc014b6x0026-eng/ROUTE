import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { apiFetch, type ApiJadwalTetap } from "@/lib/api";

export const Route = createFileRoute("/petugas/jadwal-hari-ini")({ component: Page });

function Page() {
  const [jobs, setJobs] = useState<ApiJadwalTetap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ApiJadwalTetap[]>(`/jadwal-harian/petugas/jadwal`)
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
      />
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      {!error && jobs.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-card">
          No pickups scheduled.
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map(j => (
          <div key={j.id} className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-soft transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  {j.jam_mulai?.slice(0, 5)} – {j.jam_selesai?.slice(0, 5)}
                </div>
                <div className="font-display font-bold text-lg mt-1">
                  {j.wilayah?.nama_wilayah ?? "Pickup"}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="size-3.5" />
                  {j.wilayah?.kecamatan}, {j.wilayah?.kota ?? ""}
                </div>
                <div className="text-xs text-muted-foreground mt-1 capitalize">
                  Hari: {j.hari}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
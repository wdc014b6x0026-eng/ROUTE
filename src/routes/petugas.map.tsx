import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { lazy, Suspense, useEffect, useState } from "react";
import { apiFetch, type ApiUser, type ApiJadwalTetap } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { MapPin, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapMarker } from "@/components/leaflet-map";

const LeafletMap = lazy(() =>
  import("@/components/leaflet-map").then((m) => ({ default: m.LeafletMap }))
);

export const Route = createFileRoute("/petugas/map")({ component: Page });

function Page() {
  const { user } = useAuth();
  const [residents, setResidents] = useState<ApiUser[]>([]);
  const [schedule, setSchedule] = useState<ApiJadwalTetap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }

    apiFetch<ApiJadwalTetap[]>("/jadwal-tetap")
      .then(async (jadwalList) => {
        const myJadwal = jadwalList.find(j => j.users?.id === user.id) ?? null;
        setSchedule(myJadwal);

        if (!myJadwal?.wilayah?.id) return;

        const r = await apiFetch<ApiUser[]>(`/users/wilayah/${myJadwal.wilayah.id}`);
        setResidents(r);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const withCoords = residents.filter(r => r.lat != null && r.lng != null);

  const filtered = withCoords.filter(r =>
    !search ||
    r.nama.toLowerCase().includes(search.toLowerCase()) ||
    (r.alamat ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const markers: MapMarker[] = filtered.map(r => ({
    id: r.id,
    lat: r.lat!,
    lng: r.lng!,
    label: r.nama,
    sublabel: r.alamat ?? "",
    color: "blue",
  }));

  const center: [number, number] = filtered.length > 0
    ? [filtered[0].lat!, filtered[0].lng!]
    : [-8.5069, 115.2625];

  return (
    <AppLayout>
      <PageHeader
        title="Route Map"
        description={schedule
          ? `${schedule.wilayah?.nama_wilayah ?? "Area"} · ${schedule.hari} ${schedule.jam_mulai?.slice(0, 5)}–${schedule.jam_selesai?.slice(0, 5)}`
          : "Today's area overview"}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {!loading && !schedule && (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground shadow-card text-sm">
          No schedule assigned yet. Ask an admin to create a schedule for you.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : schedule && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-card">
              <div className="flex items-center justify-center mb-1">
                <Users className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{residents.length}</div>
              <div className="text-xs text-muted-foreground">Residents in area</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-card">
              <div className="flex items-center justify-center mb-1">
                <MapPin className="size-4 text-info" />
              </div>
              <div className="text-2xl font-bold text-info">{withCoords.length}</div>
              <div className="text-xs text-muted-foreground">With location pin</div>
            </div>
          </div>

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resident by name or address…"
            className="w-full h-10 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none text-sm"
          />

          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="size-4 text-primary" />
                {filtered.length} resident{filtered.length !== 1 ? "s" : ""} shown
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full bg-blue-500 inline-block" /> Residents
              </div>
            </div>
            <Suspense fallback={
              <div className="h-[400px] flex items-center justify-center bg-muted/30">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            }>
              {filtered.length > 0 ? (
                <LeafletMap markers={markers} center={center} className="h-[400px] w-full" zoom={14} />
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <MapPin className="size-8 opacity-30" />
                  <p className="text-sm">
                    {withCoords.length === 0
                      ? "No residents have set a location yet"
                      : "No residents match your search"}
                  </p>
                </div>
              )}
            </Suspense>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border text-sm font-medium">Stop List</div>
            {residents.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No residents registered in your area yet.
              </div>
            ) : (
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {residents
                  .filter(r =>
                    !search ||
                    r.nama.toLowerCase().includes(search.toLowerCase()) ||
                    (r.alamat ?? "").toLowerCase().includes(search.toLowerCase())
                  )
                  .map((r, idx) => (
                    <div key={r.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{r.nama}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.alamat ?? "—"}</div>
                      </div>
                      <div className={cn(
                        "size-2 rounded-full shrink-0",
                        r.lat != null ? "bg-success" : "bg-muted-foreground/40"
                      )} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
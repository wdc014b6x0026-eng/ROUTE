import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { apiFetch, type ApiUser, type ApiJadwalHarian } from "@/lib/api";
import { MapPin, Loader2, Users, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapMarker } from "@/components/leaflet-map";

const LeafletMap = lazy(() =>
  import("@/components/leaflet-map").then((m) => ({ default: m.LeafletMap }))
);

export const Route = createFileRoute("/petugas/map")({ component: Page });

// ─── Helpers ─────────────────────────────────────────────────────
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

const STATUS_LABEL: Record<string, string> = {
  terjadwal: "Scheduled",
  dalam_perjalanan: "On the way",
  tiba: "Arrived",
  sudah_diambil: "Picked up",
  dibatalkan: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  terjadwal: "bg-muted-foreground/20 text-muted-foreground",
  dalam_perjalanan: "bg-blue-100 text-blue-700",
  tiba: "bg-amber-100 text-amber-700",
  sudah_diambil: "bg-green-100 text-green-700",
  dibatalkan: "bg-red-100 text-red-700",
};

// ─── Component ───────────────────────────────────────────────────
function Page() {
  const [jobs, setJobs] = useState<ApiJadwalHarian[]>([]);
  const [residentMap, setResidentMap] = useState<Record<string, ApiUser[]>>({});
  const [selectedWilayahId, setSelectedWilayahId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch<ApiJadwalHarian[]>("/jadwal-harian/petugas/jadwal");
        if (!data || data.length === 0) { setLoading(false); return; }

        setJobs(data);

        // Fetch residents per wilayah secara paralel
        const uniqueWilayahIds = [
          ...new Set(data.map(j => j.jadwal_tetap?.wilayah?.id).filter(Boolean) as string[])
        ];

        const entries = await Promise.all(
          uniqueWilayahIds.map(async (wid) => {
            try {
              const warga = await apiFetch<ApiUser[]>(`/users/wilayah/${wid}`);
              return [wid, warga] as [string, ApiUser[]];
            } catch {
              return [wid, []] as [string, ApiUser[]];
            }
          })
        );

        setResidentMap(Object.fromEntries(entries));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Semua wilayah unik dari jobs
  const wilayahList = useMemo(() => {
    const seen = new Set<string>();
    return jobs
      .map(j => j.jadwal_tetap?.wilayah)
      .filter((w): w is NonNullable<typeof w> => !!w && !seen.has(w.id) && !!seen.add(w.id));
  }, [jobs]);

  // Jobs yang sesuai filter wilayah
  const filteredJobs = useMemo(() =>
    selectedWilayahId === "all" ? jobs : jobs.filter(j => j.jadwal_tetap?.wilayah?.id === selectedWilayahId),
    [jobs, selectedWilayahId]
  );

  // Residents sesuai filter
  const activeResidents = useMemo(() => {
    if (selectedWilayahId === "all") {
      return Object.values(residentMap).flat();
    }
    return residentMap[selectedWilayahId] ?? [];
  }, [residentMap, selectedWilayahId]);

  const withCoords = useMemo(() =>
    activeResidents.filter(r => r.lat != null && r.lng != null),
    [activeResidents]
  );

  const filtered = useMemo(() =>
    withCoords.filter(r =>
      !search ||
      r.nama.toLowerCase().includes(search.toLowerCase()) ||
      (r.alamat ?? "").toLowerCase().includes(search.toLowerCase())
    ),
    [withCoords, search]
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
    : [-8.6705, 115.2126]; // default Denpasar

  return (
    <AppLayout>
      <PageHeader
        title="Route Map"
        description={selectedWilayahId === "all"
          ? `${wilayahList.length} area${wilayahList.length !== 1 ? "s" : ""} assigned today`
          : (() => {
              const w = wilayahList.find(w => w.id === selectedWilayahId);
              return w ? `${w.nama_wilayah} · ${w.kecamatan}, ${w.kota}` : "";
            })()
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground shadow-card text-sm">
          No schedule assigned for today.
        </div>
      ) : (
        <div className="space-y-4">

          {/* Wilayah filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedWilayahId("all")}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition",
                selectedWilayahId === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-muted"
              )}
            >
              All areas
            </button>
            {wilayahList.map(w => (
              <button
                key={w.id}
                onClick={() => setSelectedWilayahId(w.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition",
                  selectedWilayahId === w.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {w.nama_wilayah}
              </button>
            ))}
          </div>

          {/* Schedule cards untuk wilayah yang dipilih */}
          <div className="grid md:grid-cols-2 gap-3">
            {filteredJobs.map(j => {
              const w = j.jadwal_tetap?.wilayah;
              const window = getWindowState(j.jadwal_tetap?.jam_mulai, j.jadwal_tetap?.jam_selesai);
              return (
                <div
                  key={j.id}
                  className={cn(
                    "bg-card border border-border rounded-xl p-4 shadow-card flex items-center gap-3 transition",
                    window === "expired" && "opacity-50"
                  )}
                >
                  <div className={cn(
                    "size-9 rounded-xl flex items-center justify-center shrink-0",
                    window === "active" ? "bg-primary/10" : "bg-muted"
                  )}>
                    <MapPin className={cn("size-4", window === "active" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{w?.nama_wilayah ?? "—"}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Clock className="size-3" />
                      {j.jadwal_tetap?.jam_mulai?.slice(0, 5)}–{j.jadwal_tetap?.jam_selesai?.slice(0, 5)}
                      {window === "expired" && <span className="text-destructive/70"> · Expired</span>}
                      {window === "upcoming" && <span className="text-amber-600"> · Upcoming</span>}
                      {window === "active" && <span className="text-green-600"> · Active</span>}
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                    STATUS_COLOR[j.status] ?? "bg-muted text-muted-foreground"
                  )}>
                    {STATUS_LABEL[j.status] ?? j.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-card">
              <div className="flex items-center justify-center mb-1">
                <Users className="size-4 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{activeResidents.length}</div>
              <div className="text-xs text-muted-foreground">
                {selectedWilayahId === "all" ? "Total residents" : "Residents in area"}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-card">
              <div className="flex items-center justify-center mb-1">
                <MapPin className="size-4 text-info" />
              </div>
              <div className="text-2xl font-bold text-info">{withCoords.length}</div>
              <div className="text-xs text-muted-foreground">With location pin</div>
            </div>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resident by name or address…"
            className="w-full h-10 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none text-sm"
          />

          {/* Map */}
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

          {/* Stop list */}
          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border text-sm font-medium">
              Stop List
              {selectedWilayahId !== "all" && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  · {wilayahList.find(w => w.id === selectedWilayahId)?.nama_wilayah}
                </span>
              )}
            </div>
            {activeResidents.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No residents registered in this area yet.
              </div>
            ) : (
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {activeResidents
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
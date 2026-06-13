import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { CheckCircle2, Truck, Package, XCircle, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch, type ApiJadwalHarian } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/status")({ component: Page });

const STEPS = [
  { id: "terjadwal",        label: "Scheduled",  icon: CheckCircle2 },
  { id: "dalam_perjalanan", label: "On the way", icon: Truck },
  { id: "tiba",             label: "Arrived",    icon: MapPin },
  { id: "sudah_diambil",    label: "Picked up",  icon: Package },
];

const STATUS_LABEL: Record<string, string> = {
  terjadwal:        "Scheduled",
  dalam_perjalanan: "On the way",
  tiba:             "Arrived",
  sudah_diambil:    "Picked up",
  dibatalkan:       "Failed",
};

const STATUS_CLASS: Record<string, string> = {
  terjadwal:        "bg-warning/15 text-warning",
  dalam_perjalanan: "bg-info/15 text-info",
  tiba:             "bg-blue-500/15 text-blue-500",
  sudah_diambil:    "bg-success/15 text-success",
  dibatalkan:       "bg-destructive/15 text-destructive",
};

function getStepIndex(status: string) {
  if (status === "terjadwal")         return 0;
  if (status === "dalam_perjalanan")  return 1;
  if (status === "tiba")              return 2;
  if (status === "sudah_diambil")     return 3;
  return 0;
}

const DAY_ID: Record<string, string> = {
  senin: "Monday", selasa: "Tuesday", rabu: "Wednesday",
  kamis: "Thursday", jumat: "Friday", sabtu: "Saturday", minggu: "Sunday",
};

function Page() {
  const { user } = useAuth();
  const [jadwal, setJadwal] = useState<ApiJadwalHarian | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    apiFetch<ApiJadwalHarian[]>(`/jadwal-harian/tanggal/${today}`)
      .then(list => {
        const match =
          list.find(j => j.jadwal_tetap?.wilayah?.id === user?.wilayah_id)
          ?? list[0]
          ?? null;
        setJadwal(match);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.wilayah_id]);

  if (loading) return (
    <AppLayout>
      <PageHeader title="Pickup Status" description="Live tracking for your next pickup" />
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <PageHeader title="Pickup Status" description="Live tracking for your next pickup" />
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
    </AppLayout>
  );

  if (!jadwal) return (
    <AppLayout>
      <PageHeader title="Pickup Status" description="Live tracking for your next pickup" />
      <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-card">
        <Truck className="size-10 mx-auto opacity-30 mb-3" />
        <p className="font-medium">No pickup scheduled for today</p>
        <p className="text-sm mt-1">Check back on your next pickup day.</p>
      </div>
    </AppLayout>
  );

  const isFailed = jadwal.status === "dibatalkan";
  const currentIdx = getStepIndex(jadwal.status);

  return (
    <AppLayout>
      <PageHeader title="Pickup Status" description="Live tracking for your next pickup" />

      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {jadwal.jadwal_tetap?.wilayah?.nama_wilayah ?? "—"}
            </div>
            <div className="font-display font-bold text-2xl mt-1">
              {DAY_ID[jadwal.jadwal_tetap?.hari ?? ""] ?? jadwal.jadwal_tetap?.hari ?? "—"} Pickup
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {new Date(jadwal.tanggal).toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long",
              })}
              {jadwal.jadwal_tetap?.jam_mulai
                ? ` • ${jadwal.jadwal_tetap.jam_mulai.slice(0, 5)}`
                : ""}
              {jadwal.jadwal_tetap?.wilayah?.kecamatan
                ? ` • ${jadwal.jadwal_tetap.wilayah.kecamatan}`
                : ""}
            </div>
          </div>
          <span className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium",
            STATUS_CLASS[jadwal.status] ?? "bg-muted text-muted-foreground"
          )}>
            {STATUS_LABEL[jadwal.status] ?? jadwal.status}
          </span>
        </div>

        {/* Progress tracker — sembunyikan kalau failed */}
        {!isFailed && (
          <div className="relative mb-8">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary transition-all"
              style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
            />
            <div className="relative grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => {
                const done = i <= currentIdx;
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex flex-col items-center text-center">
                    <div className={cn(
                      "size-10 rounded-full flex items-center justify-center border-2 transition",
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-card border-border text-muted-foreground"
                    )}>
                      <Icon className="size-5" />
                    </div>
                    <div className={cn(
                      "text-xs font-medium mt-3",
                      done ? "" : "text-muted-foreground"
                    )}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Failed banner */}
        {isFailed && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-center gap-3">
            <XCircle className="size-5 text-destructive shrink-0" />
            <div>
              <div className="font-medium text-sm text-destructive">Pickup failed</div>
              {jadwal.catatan && (
                <div className="text-sm text-muted-foreground mt-0.5">{jadwal.catatan}</div>
              )}
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">Petugas</div>
            <div className="font-medium mt-1">{jadwal.users?.nama ?? "—"}</div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">Area</div>
            <div className="font-medium mt-1">
              {jadwal.jadwal_tetap?.wilayah?.nama_wilayah ?? "—"}
              {jadwal.jadwal_tetap?.wilayah?.kecamatan
                ? `, ${jadwal.jadwal_tetap.wilayah.kecamatan}`
                : ""}
            </div>
          </div>
        </div>

        {!isFailed && jadwal.catatan && (
          <div className="mt-4 rounded-xl bg-warning/10 border border-warning/30 px-4 py-3 text-sm">
            <span className="font-medium text-warning">Catatan petugas: </span>
            {jadwal.catatan}
          </div>
        )}
      </div>

      <div className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-card">
        <h3 className="font-semibold flex items-center gap-2">
          <XCircle className="size-4 text-destructive" /> If pickup fails
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Common reasons we may not be able to pick up:
        </p>
        <ul className="mt-3 text-sm space-y-2">
          {[
            "Waste was not sorted into organic / non-organic",
            "Access to your address was unavailable",
            "No waste was placed outside at pickup time",
          ].map(r => (
            <li key={r} className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-destructive mt-2 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { apiFetch, fromApiStatus, type ApiJadwalTetap } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/schedule")({ component: Page });

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_MAP: Record<string, string> = {
  senin: "Mon", selasa: "Tue", rabu: "Wed", kamis: "Thu",
  jumat: "Fri", sabtu: "Sat", minggu: "Sun",
};

function Page() {
  const { user } = useAuth();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [schedules, setSchedules] = useState<ApiJadwalTetap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.wilayah_id) { setLoading(false); return; }
    apiFetch<ApiJadwalTetap[]>(`/jadwal-tetap/wilayah/${user.wilayah_id}`)
      .then(setSchedules)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.wilayah_id]);

  const getDaySchedule = (dayCode: string) =>
    schedules.find(s => DAY_MAP[s.hari?.toLowerCase()] === dayCode);

  if (loading) return <AppLayout><div className="flex items-center justify-center h-64"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div></AppLayout>;

  return (
    <AppLayout>
      <PageHeader title="Schedule" description="Your weekly waste pickup schedule"
        action={
          <div className="inline-flex bg-muted rounded-lg p-1">
            {(["calendar", "list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-4 py-1.5 rounded-md text-sm font-medium capitalize transition",
                  view === v ? "bg-card shadow-card" : "text-muted-foreground")}>{v}</button>
            ))}
          </div>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      {!user?.wilayah_id && (
        <div className="rounded-xl bg-muted/50 p-6 text-center text-muted-foreground text-sm">
          No area assigned to your account. Contact admin to set your wilayah.
        </div>
      )}

      {schedules.length === 0 && user?.wilayah_id && !loading && (
        <div className="rounded-xl bg-muted/50 p-6 text-center text-muted-foreground text-sm">
          No schedules found for your area yet.
        </div>
      )}

      {view === "calendar" ? (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="grid grid-cols-7 gap-3">
            {DAYS.map(d => {
              const s = getDaySchedule(d);
              return (
                <div key={d} className={cn("rounded-xl p-4 min-h-32 border-2 transition",
                  s ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30")}>
                  <div className="text-xs font-semibold text-muted-foreground">{d}</div>
                  {s && (
                    <div className="mt-3">
                      <div className="size-2 rounded-full mb-2 bg-primary/60" />
                      <div className="text-sm font-medium">{s.wilayah?.nama_wilayah ?? "Pickup"}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.jam_mulai?.slice(0, 5)} – {s.jam_selesai?.slice(0, 5)}</div>
                      {s.users && <div className="text-xs text-muted-foreground mt-1">{s.users.nama}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-primary/60" />Scheduled pickup</div>
            <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-muted-foreground/40" />No pickup</div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-card divide-y divide-border">
          {schedules.map(s => (
            <div key={s.id} className="p-4 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase">{DAY_MAP[s.hari?.toLowerCase()] ?? s.hari}</div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{s.wilayah?.nama_wilayah ?? "Area"} pickup</div>
                <div className="text-xs text-muted-foreground">{s.jam_mulai?.slice(0,5)} – {s.jam_selesai?.slice(0,5)}</div>
                {s.users && <div className="text-xs text-muted-foreground">Petugas: {s.users.nama}</div>}
              </div>
              <StatusBadge status={s.is_active ? "Active" : "Inactive"} />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

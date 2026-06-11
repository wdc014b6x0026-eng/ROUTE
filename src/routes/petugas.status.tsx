import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useState } from "react";
import { CheckCircle2, Loader2, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

export const Route = createFileRoute("/petugas/status")({
  validateSearch: (search: Record<string, unknown>) => ({
    jobId: (search.jobId as string) ?? "",
    wilayah: (search.wilayah as string) ?? "",
    kecamatan: (search.kecamatan as string) ?? "",
    jamMulai: (search.jamMulai as string) ?? "",
    jamSelesai: (search.jamSelesai as string) ?? "",
  }),
  component: Page,
});

// Semua value sesuai enum DB: terjadwal | dalam_perjalanan | tiba | sudah_diambil | dibatalkan
const STATUSES = [
  { v: "dalam_perjalanan", label: "On the way", color: "bg-info/15 text-info border-info/30" },
  { v: "tiba",             label: "Arrived",    color: "bg-warning/15 text-warning border-warning/30" },
  { v: "sudah_diambil",    label: "Picked up",  color: "bg-success/15 text-success border-success/30" },
  { v: "dibatalkan",       label: "Failed",     color: "bg-destructive/15 text-destructive border-destructive/30" },
];

const FAIL_REASONS = ["Waste not sorted", "Access unavailable", "No waste outside", "Other"];

function Page() {
  const { jobId, wilayah, kecamatan, jamMulai, jamSelesai } = Route.useSearch();
  const navigate = useNavigate();

  const [status, setStatus] = useState("dalam_perjalanan");
  const [failReason, setFailReason] = useState(FAIL_REASONS[0]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!jobId) { setDone(true); return; }
    setError(""); setLoading(true);
    try {
      await apiFetch(`/jadwal-harian/${jobId}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          catatan: status === "dibatalkan" ? failReason : undefined,
        }),
      });
      setDone(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const selectedLabel = STATUSES.find(s => s.v === status)?.label ?? status;

  return (
    <AppLayout>
      <PageHeader
        title="Update Pickup Status"
        description={wilayah || "Select a job from Today's Schedule"}
      />

      {done ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card">
          <div className="size-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-7" />
          </div>
          <h3 className="font-display font-bold text-xl mt-4">Status updated!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {wilayah} has been marked as <strong>{selectedLabel}</strong>
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => navigate({
                to: "/petugas/jadwal-hari-ini",
                search: { t: Date.now() },
              })}
              className="px-5 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
            >
              Back to Schedule
            </button>
            <button
              onClick={() => setDone(false)}
              className="px-5 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted transition"
            >
              Update another
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {jobId && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card flex items-start gap-4">
              <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-lg">{wilayah || "Pickup location"}</div>
                {kecamatan && (
                  <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="size-3.5" /> {kecamatan}
                  </div>
                )}
                {jamMulai && (
                  <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="size-3.5" /> {jamMulai} – {jamSelesai}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <label className="text-sm font-medium mb-3 block">Select new status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATUSES.map(s => (
                <button
                  key={s.v}
                  onClick={() => setStatus(s.v)}
                  className={cn(
                    "rounded-xl p-4 border-2 text-sm font-medium transition",
                    status === s.v ? s.color : "border-border hover:border-primary/40"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {status === "dibatalkan" && (
              <div className="mt-5">
                <label className="text-sm font-medium">Failure reason</label>
                <select
                  value={failReason}
                  onChange={e => setFailReason(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background"
                >
                  {FAIL_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {!jobId && (
              <div className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                No job selected. Go to <strong>Today's Schedule</strong> and tap "Update Status" on a job.
              </div>
            )}

            <button
              onClick={save}
              disabled={loading}
              className="mt-6 w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Save status"}
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch, toApiStatus } from "@/lib/api";

export const Route = createFileRoute("/petugas/status")({ component: Page });

const STATUSES = [
  { v: "on_the_way",  label: "On the way", color: "bg-info/15 text-info border-info/30" },
  { v: "arrived",     label: "Arrived",    color: "bg-warning/15 text-warning border-warning/30" },
  { v: "picked_up",   label: "Picked up",  color: "bg-success/15 text-success border-success/30" },
  { v: "failed",      label: "Failed",     color: "bg-destructive/15 text-destructive border-destructive/30" },
];

const FAIL_REASONS = ["Waste not sorted", "Access unavailable", "No waste outside", "Other"];

function Page() {
  const location = useLocation();
  const state = (location.state as any) ?? {};
  const jobId: string | undefined = state.jobId;

  const [status, setStatus] = useState("on_the_way");
  const [failReason, setFailReason] = useState(FAIL_REASONS[0]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!jobId) { setDone(true); return; } // no job context, UI-only mode
    setError(""); setLoading(true);
    try {
      await apiFetch(`/jadwal-harian/${jobId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: toApiStatus(status),
          catatan: status === "failed" ? failReason : undefined,
        }),
      });
      setDone(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Update Pickup Status" description={jobId ? `Job #${jobId.slice(0, 8)}` : "Select a job from Today's Schedule"} />
      {done ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card">
          <div className="size-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-7" />
          </div>
          <h3 className="font-display font-bold text-xl mt-4">Status updated!</h3>
          <button onClick={() => setDone(false)} className="mt-4 text-sm text-primary hover:underline">Update another</button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card max-w-3xl">
          <label className="text-sm font-medium mb-3 block">Select new status</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUSES.map(s => (
              <button key={s.v} onClick={() => setStatus(s.v)}
                className={cn("rounded-xl p-4 border-2 text-sm font-medium transition",
                  status === s.v ? s.color : "border-border hover:border-primary/40")}>{s.label}</button>
            ))}
          </div>
          {status === "failed" && (
            <div className="mt-5">
              <label className="text-sm font-medium">Failure reason</label>
              <select value={failReason} onChange={e => setFailReason(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                {FAIL_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          )}
          {error && <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
          {!jobId && (
            <div className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              No job selected. Go to <strong>Today's Schedule</strong> and tap "Update status" on a job.
            </div>
          )}
          <button onClick={save} disabled={loading}
            className="mt-6 w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Save status"}
          </button>
        </div>
      )}
    </AppLayout>
  );
}

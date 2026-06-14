import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { Activity, Loader2 } from "lucide-react";
import { apiFetch, fromApiRequestStatus, type ApiRequest } from "@/lib/api";

export const Route = createFileRoute("/app/history")({ component: Page });

function Page() {
  const [history, setHistory] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ApiRequest[]>("/request/my")
      .then(setHistory)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <PageHeader title="History" description="All your pickups and requests" />
      <div className="bg-card border border-border rounded-2xl shadow-card">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h2 className="font-semibold">Activity Timeline</h2>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && <div className="px-6 py-4 text-sm text-destructive">{error}</div>}
        {!loading && !error && history.length === 0 && (
          <div className="px-6 py-16 text-center text-muted-foreground text-sm">No history yet.</div>
        )}
        <div className="divide-y divide-border">
          {history.map(h => (
            <div key={h.id} className="p-5 flex items-center gap-4 hover:bg-muted/30 transition">
              <div className="text-xs text-muted-foreground w-24 shrink-0">
                {new Date(h.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
              <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">R</div>
              <div className="flex-1">
                <div className="font-medium text-sm">{h.jenis_sampah} — {h.estimasi_jumlah}</div>
                <div className="text-xs text-muted-foreground">{h.wilayah?.nama_wilayah ?? "—"} {h.catatan ? `• ${h.catatan}` : ""}</div>
              </div>
              <StatusBadge status={fromApiRequestStatus(h.status)} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

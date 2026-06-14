import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { apiFetch, fromApiRequestStatus, toApiRequestStatus, type ApiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/petugas/request")({ component: Page });

const FILTERS = ["All", "Pending", "Accepted", "Scheduled", "Completed"];

function Page() {
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [f, setF] = useState("All");
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    apiFetch<ApiRequest[]>("/request")
      .then(setRequests)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await apiFetch(`/request/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: toApiRequestStatus(status) }),
      });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = f === "All" ? requests : requests.filter(r => fromApiRequestStatus(r.status) === f);

  return (
    <AppLayout>
      <PageHeader title="Pickup Requests" description="Accept, schedule, and complete requests" />
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {FILTERS.map(x => (
          <button key={x} onClick={() => setF(x)}
            className={cn("px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition",
              f === x ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")}>{x}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading && <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
        {error && <div className="px-6 py-4 text-sm text-destructive">{error}</div>}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Resident</th>
                  <th className="text-left p-4">Waste</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Area</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 transition">
                    <td className="p-4">
                      <div className="font-medium">{r.users?.nama ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.users?.email}</div>
                    </td>
                    <td className="p-4">{r.jenis_sampah}</td>
                    <td className="p-4">{r.estimasi_jumlah}</td>
                    <td className="p-4">{r.wilayah?.nama_wilayah ?? "—"}</td>
                    <td className="p-4"><StatusBadge status={fromApiRequestStatus(r.status)} /></td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {fromApiRequestStatus(r.status) === "Pending" && (
                          <>
                            <button onClick={() => updateStatus(r.id, "Accepted")}
                              disabled={updating === r.id}
                              className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50">
                              Accept
                            </button>
                            <button onClick={() => updateStatus(r.id, "Rejected")}
                              disabled={updating === r.id}
                              className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted disabled:opacity-50">
                              Reject
                            </button>
                          </>
                        )}
                        {fromApiRequestStatus(r.status) === "Accepted" && (
                          <button onClick={() => updateStatus(r.id, "Completed")}
                            disabled={updating === r.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-success text-white font-medium hover:opacity-90 disabled:opacity-50">
                            Mark Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">No requests found.</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

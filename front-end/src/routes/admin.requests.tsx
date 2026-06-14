import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { apiFetch, fromApiRequestStatus, toApiRequestStatus, type ApiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/requests")({ component: Page });

function Page() {
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  return (
    <AppLayout>
      <PageHeader title="Request Monitoring" description="Oversee all pickup requests across regions" />
      {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading && <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Resident</th>
                  <th className="text-left p-4">Waste</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Area</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map(r => {
                  const uiStatus = fromApiRequestStatus(r.status);
                  return (
                    <tr key={r.id} className="hover:bg-muted/30 transition">
                      <td className="p-4">{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="p-4 font-medium">{r.users?.nama ?? "—"}</td>
                      <td className="p-4">{r.jenis_sampah}</td>
                      <td className="p-4">{r.estimasi_jumlah}</td>
                      <td className="p-4">{r.wilayah?.nama_wilayah ?? "—"}</td>
                      <td className="p-4"><StatusBadge status={uiStatus} /></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {uiStatus === "Pending" && (
                            <>
                              <button onClick={() => updateStatus(r.id, "Accepted")} disabled={updating === r.id}
                                className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50">Accept</button>
                              <button onClick={() => updateStatus(r.id, "Rejected")} disabled={updating === r.id}
                                className="text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive font-medium hover:bg-destructive/10 disabled:opacity-50">Reject</button>
                            </>
                          )}
                          {uiStatus === "Accepted" && (
                            <button onClick={() => updateStatus(r.id, "Completed")} disabled={updating === r.id}
                              className="text-xs px-3 py-1.5 rounded-lg bg-success text-white font-medium hover:opacity-90 disabled:opacity-50">Mark Done</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">No requests found.</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

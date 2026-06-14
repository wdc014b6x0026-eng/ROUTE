import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { apiFetch, fromApiStatus, type ApiJadwalHarian } from "@/lib/api";

export const Route = createFileRoute("/petugas/history")({ component: Page });

function Page() {
  const [history, setHistory] = useState<ApiJadwalHarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ApiJadwalHarian[]>("/jadwal-harian/petugas/history")
      .then(setHistory)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <PageHeader title="History" description="Your completed and failed pickups" />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 && !error ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No history yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Area</th>
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Status</th>
                {/* notes column only shown if any row has catatan */}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map(h => (
                <tr key={h.id} className="hover:bg-muted/30 transition">
                  <td className="p-4">
                    {new Date(h.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="p-4 font-medium">
                    {h.jadwal_tetap?.wilayah?.nama_wilayah ?? "—"}
                    {h.jadwal_tetap?.wilayah?.kecamatan
                      ? <span className="text-xs text-muted-foreground ml-1">· {h.jadwal_tetap.wilayah.kecamatan}</span>
                      : null}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {h.jadwal_tetap?.jam_mulai?.slice(0, 5) ?? "—"}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={fromApiStatus(h.status)} />
                    {h.catatan && (
                      <div className="text-xs text-muted-foreground mt-1">{h.catatan}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
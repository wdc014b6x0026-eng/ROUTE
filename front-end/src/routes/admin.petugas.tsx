import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { apiFetch, type ApiUser } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/petugas")({ component: Page });

function Page() {
  const [transporters, setTransporters] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ApiUser[]>("/users")
      .then(data => setTransporters(data.filter(u => u.role === "petugas")))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <PageHeader title="Transporter Management" description="Monitor all registered transporters" />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : transporters.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground shadow-card text-sm">
          No transporters registered yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {transporters.map(t => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-soft transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center shadow-soft">
                  {t.nama?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "?"}
                </div>
                <div>
                  <div className="font-display font-bold">{t.nama}</div>
                  <div className="text-xs text-muted-foreground">{t.email}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{t.no_telepon ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium text-right max-w-[60%] truncate">{t.alamat ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">
                    {t.created_at ? new Date(t.created_at).toLocaleDateString("id-ID") : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

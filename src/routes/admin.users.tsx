import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { apiFetch, fromApiRole, type ApiUser } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/users")({ component: Page });

const ROLES = ["All", "Resident", "Transporter", "Admin"];
const roleMap: Record<string, string> = { warga: "Resident", petugas: "Transporter", admin: "Admin" };

function Page() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [f, setF] = useState("All");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    apiFetch<ApiUser[]>("/users")
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = f === "All" ? users : users.filter(u => roleMap[u.role] === f);

  return (
    <AppLayout>
      <PageHeader title="User Management" description="View, approve, and manage all platform users" />
      {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="flex gap-2 mb-4">
        {ROLES.map(r => (
          <button key={r} onClick={() => setF(r)}
            className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition",
              f === r ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")}>{r}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading && <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Address</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-muted/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-gradient-hero text-primary-foreground text-xs flex items-center justify-center font-bold">
                          {u.nama?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "?"}
                        </div>
                        <span className="font-medium">{u.nama}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4"><StatusBadge status={roleMap[u.role] ?? u.role} /></td>
                    <td className="p-4 text-muted-foreground">{u.no_telepon ?? "—"}</td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">{u.alamat ?? "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => deleteUser(u.id)} disabled={deleting === u.id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive font-medium hover:bg-destructive/10 disabled:opacity-50">
                          {deleting === u.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">No users found.</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

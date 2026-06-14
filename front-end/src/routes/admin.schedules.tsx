import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { apiFetch, type ApiJadwalTetap, type ApiWilayah, type ApiUser } from "@/lib/api";

export const Route = createFileRoute("/admin/schedules")({ component: Page });

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_MAP_ID: Record<string, string> = { senin:"Mon", selasa:"Tue", rabu:"Wed", kamis:"Thu", jumat:"Fri", sabtu:"Sat", minggu:"Sun" };
const HARI_LIST = ["senin","selasa","rabu","kamis","jumat","sabtu","minggu"];

function Page() {
  const [schedules, setSchedules] = useState<ApiJadwalTetap[]>([]);
  const [wilayahList, setWilayahList] = useState<ApiWilayah[]>([]);
  const [petugasList, setPetugasList] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [form, setForm] = useState({ wilayah_id:"", petugas_id:"", hari:"senin", jam_mulai:"07:00", jam_selesai:"09:00" });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch<ApiJadwalTetap[]>("/jadwal-tetap"),
      apiFetch<ApiWilayah[]>("/wilayah"),
      apiFetch<ApiUser[]>("/users"),
    ]).then(([s, w, u]) => {
      setSchedules(s);
      setWilayahList(w);
      setPetugasList(u.filter(u => u.role === "petugas"));
    }).catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/jadwal-tetap", { method: "POST", body: JSON.stringify(form) });
      setShowForm(false);
      setForm({ wilayah_id:"", petugas_id:"", hari:"senin", jam_mulai:"07:00", jam_selesai:"09:00" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this schedule?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/jadwal-tetap/${id}`, { method: "DELETE" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Schedule Management" description="Create and assign recurring pickup schedules"
        action={
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-90">
            <Plus className="size-4" />New schedule
          </button>
        }
      />

      {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      {/* New schedule form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5">
          <h3 className="font-semibold mb-4">New Schedule</h3>
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Area (Wilayah)</label>
              <select required value={form.wilayah_id} onChange={e => setForm(f => ({...f, wilayah_id: e.target.value}))}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                <option value="">Select area…</option>
                {wilayahList.map(w => <option key={w.id} value={w.id}>{w.nama_wilayah} — {w.kecamatan}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Petugas (transporter)</label>
              <select value={form.petugas_id} onChange={e => setForm(f => ({...f, petugas_id: e.target.value}))}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                <option value="">Unassigned</option>
                {petugasList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Day</label>
              <select value={form.hari} onChange={e => setForm(f => ({...f, hari: e.target.value}))}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                {HARI_LIST.map(h => <option key={h} value={h}>{h.charAt(0).toUpperCase()+h.slice(1)}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium">Start time</label>
                <input type="time" value={form.jam_mulai} onChange={e => setForm(f => ({...f, jam_mulai: e.target.value}))}
                  className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">End time</label>
                <input type="time" value={form.jam_selesai} onChange={e => setForm(f => ({...f, jam_selesai: e.target.value}))}
                  className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
              </div>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60 flex items-center gap-2">
                {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="h-10 px-6 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Weekly overview */}
      {!loading && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5">
          <h2 className="font-display font-bold text-lg mb-4">Weekly Overview</h2>
          <div className="grid grid-cols-7 gap-3">
            {DAYS.map(d => {
              const items = schedules.filter(s => DAY_MAP_ID[s.hari?.toLowerCase()] === d);
              return (
                <div key={d} className="rounded-xl bg-muted/30 p-3 min-h-32">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">{d}</div>
                  {items.map(s => (
                    <div key={s.id} className="text-xs bg-card rounded-lg p-2 mb-2 border border-border">
                      <div className="font-medium">{s.wilayah?.nama_wilayah ?? "—"}</div>
                      <div className="text-muted-foreground">{s.jam_mulai?.slice(0,5)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading && <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
        {!loading && (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-4">Area</th>
                <th className="text-left p-4">Day</th>
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Petugas</th>
                <th className="text-left p-4">Active</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedules.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition">
                  <td className="p-4 font-medium">{s.wilayah?.nama_wilayah ?? "—"}</td>
                  <td className="p-4 capitalize">{s.hari}</td>
                  <td className="p-4">{s.jam_mulai?.slice(0,5)} – {s.jam_selesai?.slice(0,5)}</td>
                  <td className="p-4">{s.users?.nama ?? "Unassigned"}</td>
                  <td className="p-4">{s.is_active ? "✓" : "—"}</td>
                  <td className="p-4">
                    <button onClick={() => del(s.id)} disabled={deleting === s.id}
                      className="text-destructive hover:text-destructive/80 disabled:opacity-50">
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && schedules.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No schedules yet. Click "New schedule" to create one.</div>
        )}
      </div>
    </AppLayout>
  );
}

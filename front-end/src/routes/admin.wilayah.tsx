import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { Plus, Loader2, Pencil, Trash2, Check, X } from "lucide-react";
import { apiFetch, type ApiWilayah } from "@/lib/api";

export const Route = createFileRoute("/admin/wilayah")({ component: Page });

type EditForm = { nama_wilayah: string; kecamatan: string; kota: string };
const EMPTY: EditForm = { nama_wilayah: "", kecamatan: "", kota: "" };

function Page() {
  const [list, setList] = useState<ApiWilayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EditForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    apiFetch<ApiWilayah[]>("/wilayah")
      .then(setList).catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await apiFetch("/wilayah", { method: "POST", body: JSON.stringify(form) });
      setForm(EMPTY); setShowForm(false); load();
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const update = async (id: string) => {
    setSaving(true);
    try {
      await apiFetch(`/wilayah/${id}`, { method: "PUT", body: JSON.stringify(editForm) });
      setEditing(null); load();
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this wilayah?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/wilayah/${id}`, { method: "DELETE" }); load();
    } catch (err: any) { setError(err.message); } finally { setDeleting(null); }
  };

  return (
    <AppLayout>
      <PageHeader title="Wilayah Management" description="Manage service areas and regions"
        action={
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-90">
            <Plus className="size-4" />New wilayah
          </button>
        }
      />
      {error && <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5">
          <h3 className="font-semibold mb-4">New Area</h3>
          <form onSubmit={create} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Nama Wilayah</label>
              <input required value={form.nama_wilayah} onChange={e => setForm(f => ({...f, nama_wilayah: e.target.value}))}
                placeholder="e.g. Ubud Tengah" className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Kecamatan</label>
              <input required value={form.kecamatan} onChange={e => setForm(f => ({...f, kecamatan: e.target.value}))}
                placeholder="e.g. Ubud" className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Kota / Kabupaten</label>
              <input required value={form.kota} onChange={e => setForm(f => ({...f, kota: e.target.value}))}
                placeholder="e.g. Gianyar" className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
            </div>
            <div className="sm:col-span-3 flex gap-3">
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

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading && <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
        {!loading && (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-4">Nama Wilayah</th>
                <th className="text-left p-4">Kecamatan</th>
                <th className="text-left p-4">Kota</th>
                <th className="text-left p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map(w => (
                <tr key={w.id} className="hover:bg-muted/30 transition">
                  {editing === w.id ? (
                    <>
                      <td className="p-3"><input value={editForm.nama_wilayah} onChange={e => setEditForm(f => ({...f, nama_wilayah: e.target.value}))} className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm" /></td>
                      <td className="p-3"><input value={editForm.kecamatan} onChange={e => setEditForm(f => ({...f, kecamatan: e.target.value}))} className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm" /></td>
                      <td className="p-3"><input value={editForm.kota} onChange={e => setEditForm(f => ({...f, kota: e.target.value}))} className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm" /></td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => update(w.id)} disabled={saving} className="text-success hover:text-success/80"><Check className="size-4" /></button>
                          <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-medium">{w.nama_wilayah}</td>
                      <td className="p-4">{w.kecamatan}</td>
                      <td className="p-4">{w.kota}</td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button onClick={() => { setEditing(w.id); setEditForm({ nama_wilayah: w.nama_wilayah, kecamatan: w.kecamatan, kota: w.kota }); }}
                            className="text-muted-foreground hover:text-foreground"><Pencil className="size-4" /></button>
                          <button onClick={() => del(w.id)} disabled={deleting === w.id}
                            className="text-destructive hover:text-destructive/80 disabled:opacity-50"><Trash2 className="size-4" /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && list.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">No areas yet. Click "New wilayah" to add one.</div>
        )}
      </div>
    </AppLayout>
  );
}

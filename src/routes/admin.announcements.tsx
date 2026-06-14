import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, Mail, Loader2, Trash2 } from "lucide-react";

interface ApiPengumuman {
  id: string; judul: string; isi: string; tipe: string;
  is_active: boolean; berlaku_mulai?: string; berlaku_sampai?: string;
  created_at: string;
}

export const Route = createFileRoute("/admin/announcements")({ component: Page });

const TYPES = ["Jadwal", "Kebijakan", "Darurat", "Event", "Umum"];

function Page() {
  const [items, setItems] = useState<ApiPengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ judul: "", isi: "", tipe: TYPES[0], berlaku_mulai: "", berlaku_sampai: "" });

  const load = () => {
    setLoading(true);
    apiFetch<ApiPengumuman[]>("/pengumuman")
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/pengumuman", {
        method: "POST",
        body: JSON.stringify({
          judul: form.judul, isi: form.isi, tipe: form.tipe,
          berlaku_mulai: form.berlaku_mulai || null,
          berlaku_sampai: form.berlaku_sampai || null,
        }),
      });
      setForm({ judul: "", isi: "", tipe: TYPES[0], berlaku_mulai: "", berlaku_sampai: "" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item: ApiPengumuman) => {
    try {
      await apiFetch(`/pengumuman/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ judul: item.judul, isi: item.isi, tipe: item.tipe, is_active: !item.is_active }),
      });
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/pengumuman/${id}`, { method: "DELETE" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Announcement Management"
        description="Publish notices to your community"
        action={<span className="text-sm text-muted-foreground">{items.length} total</span>}
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm shadow-card">
              No announcements yet. Use the form to publish one.
            </div>
          )}
          {items.map(a => (
            <div key={a.id} className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold">{a.judul}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${a.is_active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                      {a.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.isi}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(a.created_at).toLocaleDateString("id-ID")} • {a.tipe}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => toggle(a)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted">
                  {a.is_active ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => del(a.id)} disabled={deleting === a.id}
                  className="text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive font-medium hover:bg-destructive/10 flex items-center gap-1 disabled:opacity-50">
                  <Trash2 className="size-3" />{deleting === a.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Compose form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Plus className="size-4" /> New Announcement
          </h3>
          <form onSubmit={publish} className="space-y-3">
            <input required value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
              placeholder="Announcement title"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <select value={form.tipe} onChange={e => setForm(f => ({ ...f, tipe: e.target.value }))}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea required rows={4} value={form.isi} onChange={e => setForm(f => ({ ...f, isi: e.target.value }))}
              placeholder="Message body"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <div>
              <label className="text-xs text-muted-foreground">Valid from</label>
              <input type="date" value={form.berlaku_mulai} onChange={e => setForm(f => ({ ...f, berlaku_mulai: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Valid until</label>
              <input type="date" value={form.berlaku_sampai} onChange={e => setForm(f => ({ ...f, berlaku_sampai: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <button type="submit" disabled={saving}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <><Plus className="size-4" />Publish</>}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

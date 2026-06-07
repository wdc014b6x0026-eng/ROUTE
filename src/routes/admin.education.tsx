import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Plus, FileText, Eye, Edit3, Trash2, Loader2, X, Check } from "lucide-react";

interface ApiArtikel {
  id: string; judul: string; konten: string; kategori?: string;
  thumbnail_url?: string; is_published: boolean; published_at?: string; created_at: string;
  users?: { id: string; nama: string };
}

export const Route = createFileRoute("/admin/education")({ component: Page });

const CATEGORIES = ["Kompos", "Pemisahan", "Daur Ulang", "Komunitas", "Organik", "Umum"];

function Page() {
  const [articles, setArticles] = useState<ApiArtikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ judul: "", konten: "", kategori: CATEGORIES[0], thumbnail_url: "", is_published: false });

  const load = () => {
    setLoading(true);
    apiFetch<ApiArtikel[]>("/artikel")
      .then(setArticles)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/artikel", { method: "POST", body: JSON.stringify(form) });
      setShowForm(false);
      setForm({ judul: "", konten: "", kategori: CATEGORIES[0], thumbnail_url: "", is_published: false });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (a: ApiArtikel) => {
    try {
      await apiFetch(`/artikel/${a.id}`, {
        method: "PUT",
        body: JSON.stringify({ judul: a.judul, konten: a.konten, kategori: a.kategori, is_published: !a.is_published }),
      });
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/artikel/${id}`, { method: "DELETE" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const readTime = (konten: string) => Math.max(1, Math.ceil(konten.split(" ").length / 200));

  return (
    <AppLayout>
      <PageHeader
        title="Education CMS"
        description="Manage articles and educational content"
        action={
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-90">
            {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
            {showForm ? "Cancel" : "New article"}
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      {showForm && (
        <div className="mb-5 bg-card border border-border rounded-2xl p-6 shadow-card">
          <h3 className="font-bold mb-4">New Article</h3>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input required value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Thumbnail URL</label>
              <input value={form.thumbnail_url} onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                placeholder="https://…"
                className="mt-1.5 w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea required rows={6} value={form.konten} onChange={e => setForm(f => ({ ...f, konten: e.target.value }))}
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} />
              Publish immediately
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 flex items-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="size-4 animate-spin" /> : <><Check className="size-4" />Save</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Read time</th>
                  <th className="text-left p-4">Published</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-muted/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <FileText className="size-4" />
                        </div>
                        <div>
                          <div className="font-medium">{a.judul}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{a.konten?.slice(0, 80)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {a.kategori ?? "—"}
                      </span>
                    </td>
                    <td className="p-4">{readTime(a.konten ?? "")} min</td>
                    <td className="p-4 text-muted-foreground">
                      {a.published_at ? new Date(a.published_at).toLocaleDateString("id-ID") : "—"}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${a.is_published ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                        {a.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => togglePublish(a)} title={a.is_published ? "Unpublish" : "Publish"}
                          className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
                          <Eye className="size-4" />
                        </button>
                        <button onClick={() => del(a.id)} disabled={deleting === a.id} title="Delete"
                          className="size-8 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center disabled:opacity-50">
                          {deleting === a.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {articles.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">No articles yet.</div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

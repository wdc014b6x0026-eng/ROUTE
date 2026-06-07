import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Pin, Megaphone, Loader2 } from "lucide-react";

interface ApiPengumuman {
  id: string; judul: string; isi: string; tipe: string;
  is_active: boolean; berlaku_mulai?: string; berlaku_sampai?: string;
  created_at: string; users?: { id: string; nama: string };
}

export const Route = createFileRoute("/announcements")({ component: Page });

function Content() {
  const [announcements, setAnnouncements] = useState<ApiPengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<ApiPengumuman[]>("/pengumuman/active")
      .then(setAnnouncements)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Announcements" description="Schedule changes, policy updates, and notices" />
      {loading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive mb-4">
          {error}
        </div>
      )}
      {!loading && !error && announcements.length === 0 && (
        <div className="rounded-xl bg-muted/50 p-10 text-center text-muted-foreground text-sm">
          No announcements at the moment.
        </div>
      )}
      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-soft transition">
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Megaphone className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-lg">{a.judul}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{a.tipe}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{a.isi}</p>
                <div className="text-xs text-muted-foreground mt-3 flex flex-wrap gap-3">
                  <span>{new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                  {a.berlaku_sampai && (
                    <span>Valid until {new Date(a.berlaku_sampai).toLocaleDateString("id-ID")}</span>
                  )}
                  {a.users && <span>By {a.users.nama}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Page() {
  const { user } = useAuth();
  if (user) return <AppLayout><Content /></AppLayout>;
  return <div className="min-h-screen bg-background p-4 lg:p-8 max-w-5xl mx-auto"><Content /></div>;
}

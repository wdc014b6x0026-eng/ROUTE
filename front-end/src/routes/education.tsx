import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Search, BookOpen, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiArtikel {
  id: string; judul: string; konten: string; kategori?: string;
  thumbnail_url?: string; is_published: boolean; published_at?: string;
  created_at: string; users?: { id: string; nama: string };
}

export const Route = createFileRoute("/education")({ component: Page });

function Content() {
  const [articles, setArticles] = useState<ApiArtikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    apiFetch<ApiArtikel[]>("/artikel/published")
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(articles.map(a => a.kategori).filter(Boolean) as string[]))];

  const filtered = articles.filter(a =>
    (cat === "All" || a.kategori === cat) &&
    (q === "" || a.judul.toLowerCase().includes(q.toLowerCase()))
  );

  const readTime = (konten: string) => Math.max(1, Math.ceil(konten.split(" ").length / 200));
  const featured = articles[0];

  return (
    <>
      <PageHeader title="Education" description="Learn how to manage waste sustainably" />

      <div className="bg-card border border-border rounded-2xl p-4 shadow-card mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-muted/50 focus:bg-background focus:ring-2 focus:ring-ring outline-none transition" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={cn("px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition",
                cat === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")}>{c}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && featured && cat === "All" && q === "" && (
        <div className="bg-gradient-hero text-primary-foreground rounded-2xl p-8 mb-6 shadow-soft grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80 mb-2">Featured</div>
            <h2 className="font-display font-bold text-2xl md:text-3xl">{featured.judul}</h2>
            <p className="mt-3 opacity-90 line-clamp-3">{featured.konten}</p>
            <div className="flex items-center gap-4 mt-4 text-sm opacity-80">
              <span>{featured.kategori}</span>
              <span className="flex items-center gap-1"><Clock className="size-3.5" /> {readTime(featured.konten)} min read</span>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <BookOpen className="size-32 opacity-30" />
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.slice(cat === "All" && q === "" ? 1 : 0).map(a => (
            <article key={a.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-soft hover:-translate-y-0.5 transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">{a.kategori ?? "—"}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" />{readTime(a.konten)} min
                </span>
              </div>
              <h3 className="font-display font-bold text-lg leading-snug">{a.judul}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{a.konten}</p>
              <div className="text-xs text-muted-foreground mt-4">
                {a.published_at ? new Date(a.published_at).toLocaleDateString("id-ID") : new Date(a.created_at).toLocaleDateString("id-ID")}
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="size-12 mx-auto opacity-30 mb-3" />
          <p>No articles found</p>
        </div>
      )}
    </>
  );
}

function Page() {
  const { user } = useAuth();
  if (user) return <AppLayout><Content /></AppLayout>;
  return <div className="min-h-screen bg-background p-4 lg:p-8 max-w-7xl mx-auto"><Content /></div>;
}

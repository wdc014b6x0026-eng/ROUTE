import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockArticles } from "@/lib/mock-data";
import { Plus, FileText, Eye, Edit3, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/education")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Education CMS" description="Manage articles and educational content"
        action={<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-90"><Plus className="size-4" />New article</button>}
      />
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="text-left p-4">Title</th><th className="text-left p-4">Category</th><th className="text-left p-4">Read time</th><th className="text-left p-4">Published</th><th className="text-left p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockArticles.map(a => (
              <tr key={a.id} className="hover:bg-muted/30 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><FileText className="size-4" /></div>
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{a.excerpt}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4"><span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">{a.category}</span></td>
                <td className="p-4">{a.readTime} min</td>
                <td className="p-4">{a.date}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="size-8 rounded-lg hover:bg-muted flex items-center justify-center" title="View"><Eye className="size-4" /></button>
                    <button className="size-8 rounded-lg hover:bg-muted flex items-center justify-center" title="Edit"><Edit3 className="size-4" /></button>
                    <button className="size-8 rounded-lg hover:bg-destructive/10 text-destructive flex items-center justify-center" title="Delete"><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

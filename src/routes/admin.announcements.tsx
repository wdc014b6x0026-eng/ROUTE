import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockAnnouncements } from "@/lib/mock-data";
import { Plus, Pin, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/announcements")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Announcement Management" description="Publish notices to your community"
        action={<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-90"><Plus className="size-4" />New announcement</button>}
      />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {mockAnnouncements.map(a => (
            <div key={a.id} className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold">{a.title}</h3>
                    {a.pinned && <span className="text-xs px-2 py-0.5 rounded bg-warning/15 text-warning font-medium flex items-center gap-1"><Pin className="size-3" />Pinned</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{a.body}</p>
                  <div className="text-xs text-muted-foreground mt-2">{a.date} • {a.category}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted">Edit</button>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted flex items-center gap-1"><Pin className="size-3"/>{a.pinned ? "Unpin" : "Pin"}</button>
                <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted flex items-center gap-1"><Mail className="size-3"/>Email broadcast</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-display font-bold mb-4">Quick Compose</h3>
          <div className="space-y-3">
            <input placeholder="Announcement title" className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm" />
            <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm">
              <option>Schedule</option><option>Policy</option><option>Emergency</option><option>Event</option>
            </select>
            <textarea rows={4} placeholder="Message body" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Pin to top</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Email broadcast</label>
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-sm">Publish</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

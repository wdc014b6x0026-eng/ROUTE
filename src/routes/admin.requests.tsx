import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { mockRequests } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/requests")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Request Monitoring" description="Oversee all pickup requests across regions" />
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="text-left p-4">Date</th><th className="text-left p-4">Resident</th><th className="text-left p-4">Type</th><th className="text-left p-4">Waste</th><th className="text-left p-4">Status</th><th className="text-left p-4">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockRequests.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition">
                  <td className="p-4">{r.date}</td>
                  <td className="p-4 font-medium">{r.resident}</td>
                  <td className="p-4">{r.type}</td>
                  <td className="p-4">{r.wasteType} • {r.amount}</td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted">Reassign</button>
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted">Override</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

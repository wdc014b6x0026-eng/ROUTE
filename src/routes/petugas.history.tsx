import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";

export const Route = createFileRoute("/petugas/history")({ component: Page });

const history = [
  { id: 1, date: "2026-05-23", resident: "Made Ayu", type: "Pickup", status: "Completed" },
  { id: 2, date: "2026-05-23", resident: "Ketut Dewi", type: "Request", status: "Completed" },
  { id: 3, date: "2026-05-22", resident: "I Gusti Bagus", type: "Pickup", status: "Failed" },
  { id: 4, date: "2026-05-22", resident: "Nyoman Sari", type: "Pickup", status: "Completed" },
  { id: 5, date: "2026-05-21", resident: "Made Ayu", type: "Pickup", status: "Completed" },
];

function Page() {
  return (
    <AppLayout>
      <PageHeader title="History" description="Your completed and failed pickups" />
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Resident</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map(h => (
              <tr key={h.id} className="hover:bg-muted/30 transition">
                <td className="p-4">{h.date}</td>
                <td className="p-4 font-medium">{h.resident}</td>
                <td className="p-4">{h.type}</td>
                <td className="p-4"><StatusBadge status={h.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

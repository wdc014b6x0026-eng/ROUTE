import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { mockRequests } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/petugas/request")({ component: Page });

const FILTERS = ["All", "Pending", "Accepted", "Scheduled", "Completed"];

function Page() {
  const [f, setF] = useState("All");
  const filtered = f === "All" ? mockRequests : mockRequests.filter(r => r.status === f);
  return (
    <AppLayout>
      <PageHeader title="Pickup Requests" description="Accept, schedule, and complete requests" />
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {FILTERS.map(x => (
          <button key={x} onClick={() => setF(x)}
            className={cn("px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition",
              f === x ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")}>{x}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-4">Resident</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Waste</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-muted/30 transition">
                  <td className="p-4">
                    <div className="font-medium">{r.resident}</div>
                    <div className="text-xs text-muted-foreground">{r.address}</div>
                  </td>
                  <td className="p-4">{r.type}</td>
                  <td className="p-4">{r.wasteType}</td>
                  <td className="p-4">{r.amount}</td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">Accept</button>
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted">Reject</button>
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

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { mockAllUsers } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({ component: Page });

const ROLES = ["All", "Resident", "Transporter", "Admin"];

function Page() {
  const [f, setF] = useState("All");
  const list = f === "All" ? mockAllUsers : mockAllUsers.filter(u => u.role === f);
  return (
    <AppLayout>
      <PageHeader title="User Management" description="View, approve, and manage all platform users" />
      <div className="flex gap-2 mb-4">
        {ROLES.map(r => (
          <button key={r} onClick={() => setF(r)}
            className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition",
              f === r ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70")}>{r}</button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Area</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-gradient-hero text-primary-foreground text-xs flex items-center justify-center font-bold">
                        {u.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4">{u.area}</td>
                  <td className="p-4"><StatusBadge status={u.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {u.status === "Pending" && <button className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">Approve</button>}
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-border font-medium hover:bg-muted">Edit</button>
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive font-medium hover:bg-destructive/10">Disable</button>
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

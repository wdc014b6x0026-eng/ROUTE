import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/petugas/status")({ component: Page });

const STATUSES = [
  { v: "on_the_way", label: "On the way", color: "bg-info/15 text-info border-info/30" },
  { v: "arrived", label: "Arrived", color: "bg-warning/15 text-warning border-warning/30" },
  { v: "picked_up", label: "Picked up", color: "bg-success/15 text-success border-success/30" },
  { v: "failed", label: "Failed", color: "bg-destructive/15 text-destructive border-destructive/30" },
];

function Page() {
  const [status, setStatus] = useState("on_the_way");
  const [done, setDone] = useState(false);
  return (
    <AppLayout>
      <PageHeader title="Update Pickup Status" description="Job #J-2026-0524 • Made Ayu • Jl. Raya Ubud No. 12" />
      {done ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card">
          <div className="size-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-7" />
          </div>
          <h3 className="font-display font-bold text-xl mt-4">Status updated!</h3>
          <button onClick={() => setDone(false)} className="mt-4 text-sm text-primary hover:underline">Update another</button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card max-w-3xl">
          <label className="text-sm font-medium mb-3 block">Select new status</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATUSES.map(s => (
              <button key={s.v} onClick={() => setStatus(s.v)}
                className={cn("rounded-xl p-4 border-2 text-sm font-medium transition",
                  status === s.v ? s.color : "border-border hover:border-primary/40")}>{s.label}</button>
            ))}
          </div>
          {status === "failed" && (
            <div className="mt-5 animate-fade-in">
              <label className="text-sm font-medium">Failure reason (required)</label>
              <select className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                <option>Waste not sorted</option>
                <option>Access unavailable</option>
                <option>No waste outside</option>
                <option>Other</option>
              </select>
            </div>
          )}
          <div className="mt-5">
            <label className="text-sm font-medium">Proof photo (optional)</label>
            <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/40 transition cursor-pointer">
              <Upload className="size-6 mx-auto text-muted-foreground" />
              <div className="text-sm mt-2">Upload proof photo</div>
            </div>
          </div>
          <button onClick={() => setDone(true)} className="mt-6 w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition">
            Save status
          </button>
        </div>
      )}
    </AppLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { CheckCircle2, Truck, MapPin, Package, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/status")({ component: Page });

const STEPS = [
  { id: "scheduled", label: "Scheduled", icon: CheckCircle2, time: "06:50" },
  { id: "on_the_way", label: "On the way", icon: Truck, time: "07:12" },
  { id: "arrived", label: "Arrived", icon: MapPin, time: "07:24" },
  { id: "picked_up", label: "Picked up", icon: Package, time: "—" },
];

function Page() {
  const currentIdx = 1; // on the way
  return (
    <AppLayout>
      <PageHeader title="Pickup Status" description="Live tracking for your next pickup" />

      <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Pickup #2026-0524</div>
            <div className="font-display font-bold text-2xl mt-1">Organic waste pickup</div>
            <div className="text-sm text-muted-foreground mt-1">Wednesday 27 May • 07:00 • Jl. Raya Ubud No. 12</div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-info/15 text-info text-sm font-medium">On the way</span>
        </div>

        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
          <div className="absolute top-5 left-0 h-0.5 bg-primary transition-all" style={{ width: `${(currentIdx/(STEPS.length-1))*100}%` }} />
          <div className="relative grid grid-cols-4 gap-2">
            {STEPS.map((s, i) => {
              const done = i <= currentIdx;
              const Icon = s.icon;
              return (
                <div key={s.id} className="flex flex-col items-center text-center">
                  <div className={cn("size-10 rounded-full flex items-center justify-center border-2 transition",
                    done ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-muted-foreground"
                  )}>
                    <Icon className="size-5" />
                  </div>
                  <div className={cn("text-sm font-medium mt-3", done ? "" : "text-muted-foreground")}>{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.time}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">Transporter</div>
            <div className="font-medium mt-1">Wayan Sutha</div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">Vehicle</div>
            <div className="font-medium mt-1">Truck B-12</div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="text-xs text-muted-foreground">ETA</div>
            <div className="font-medium mt-1">~12 minutes</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-card">
        <h3 className="font-semibold flex items-center gap-2"><XCircle className="size-4 text-destructive" /> If pickup fails</h3>
        <p className="text-sm text-muted-foreground mt-2">Common reasons we may not be able to pick up:</p>
        <ul className="mt-3 text-sm space-y-2">
          {["Waste was not sorted into organic / non-organic", "Access to your address was unavailable", "No waste was placed outside at pickup time"].map(r => (
            <li key={r} className="flex items-start gap-2"><span className="size-1.5 rounded-full bg-destructive mt-2 shrink-0" />{r}</li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

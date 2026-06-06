import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { lazy, Suspense, useState } from "react";
import { mockTodayJobs } from "@/lib/mock-data";
import { MapPin, Loader2, Clock, CheckCircle2, Truck, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const LeafletMap = lazy(() =>
  import("@/components/leaflet-map").then((m) => ({ default: m.LeafletMap }))
);

export const Route = createFileRoute("/petugas/map")({ component: Page });

const STATUS_COLOR = {
  scheduled: "blue",
  on_the_way: "orange",
  picked_up: "green",
  skipped: "red",
} as const;

const STATUS_ICON = {
  scheduled: Clock,
  on_the_way: Truck,
  picked_up: CheckCircle2,
  skipped: Circle,
};

const STATUS_LABEL = {
  scheduled: "Scheduled",
  on_the_way: "On the Way",
  picked_up: "Picked Up",
  skipped: "Skipped",
};

function Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const jobs = mockTodayJobs.filter((j) => j.lat && j.lng);

  const markers = jobs.map((j, idx) => ({
    id: j.id,
    lat: j.lat!,
    lng: j.lng!,
    label: `#${idx + 1} — ${j.resident}`,
    sublabel: j.address,
    color: STATUS_COLOR[j.status as keyof typeof STATUS_COLOR] ?? "blue",
    pulse: j.status === "on_the_way",
  }));

  const stats = {
    total: jobs.length,
    done: jobs.filter((j) => j.status === "picked_up").length,
    pending: jobs.filter((j) => j.status === "scheduled").length,
    active: jobs.filter((j) => j.status === "on_the_way").length,
  };

  return (
    <AppLayout>
      <PageHeader
        title="Route Map"
        description="Today's pickup locations and route overview"
      />

      <div className="space-y-4">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Stops", value: stats.total, color: "text-foreground" },
            { label: "Completed", value: stats.done, color: "text-success" },
            { label: "Remaining", value: stats.pending + stats.active, color: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center shadow-card">
              <div className={cn("text-2xl font-bold", s.color)}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-primary" /> Today's Route
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500 inline-block" />Scheduled</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-400 inline-block" />On way</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500 inline-block" />Done</span>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="h-[380px] flex items-center justify-center bg-muted/30">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <LeafletMap
              markers={markers}
              className="h-[380px] w-full"
              showRoute
              zoom={13}
            />
          </Suspense>
        </div>

        {/* Job list */}
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-sm font-medium">Stop List</div>
          <div className="divide-y divide-border">
            {jobs.map((job, idx) => {
              const Icon = STATUS_ICON[job.status as keyof typeof STATUS_ICON] ?? Circle;
              const color = STATUS_COLOR[job.status as keyof typeof STATUS_COLOR] ?? "blue";
              const colorCls = {
                blue: "text-blue-500 bg-blue-500/10",
                orange: "text-orange-500 bg-orange-500/10",
                green: "text-green-500 bg-green-500/10",
                red: "text-red-500 bg-red-500/10",
                purple: "text-purple-500 bg-purple-500/10",
              }[color];

              return (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedId(selectedId === job.id ? null : job.id)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-muted/40 transition",
                    selectedId === job.id && "bg-primary/5"
                  )}
                >
                  <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold", colorCls)}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{job.resident}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{job.time}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{job.address}</div>
                    {selectedId === job.id && (
                      <div className="mt-2 text-xs bg-muted rounded-lg px-3 py-2 flex items-start gap-1.5">
                        <span className="font-medium">Notes:</span> {job.notes}
                      </div>
                    )}
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0", colorCls)}>
                    <Icon className="size-3" />
                    {STATUS_LABEL[job.status as keyof typeof STATUS_LABEL]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

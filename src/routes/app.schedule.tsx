import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { mockSchedule } from "@/lib/mock-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/schedule")({ component: Page });

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function Page() {
  const [view, setView] = useState<"calendar"|"list">("calendar");
  return (
    <AppLayout>
      <PageHeader title="Schedule" description="Your weekly waste pickup schedule"
        action={
          <div className="inline-flex bg-muted rounded-lg p-1">
            {(["calendar","list"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-4 py-1.5 rounded-md text-sm font-medium capitalize transition",
                  view === v ? "bg-card shadow-card" : "text-muted-foreground")}>{v}</button>
            ))}
          </div>
        }
      />

      {view === "calendar" ? (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="grid grid-cols-7 gap-3">
            {DAYS.map(d => {
              const s = mockSchedule.find(x => x.day.startsWith(d));
              return (
                <div key={d} className={cn("rounded-xl p-4 min-h-32 border-2 transition",
                  s ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30")}>
                  <div className="text-xs font-semibold text-muted-foreground">{d}</div>
                  {s && (
                    <div className="mt-3">
                      <div className={cn("size-2 rounded-full mb-2",
                        s.status === "picked_up" ? "bg-success"
                        : s.status === "on_the_way" ? "bg-info"
                        : "bg-muted-foreground/40"
                      )} />
                      <div className="text-sm font-medium">{s.type}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.time}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-xs">
            <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-success"/>Completed</div>
            <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-info"/>On the way</div>
            <div className="flex items-center gap-2"><div className="size-2.5 rounded-full bg-muted-foreground/40"/>Upcoming</div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-card divide-y divide-border">
          {mockSchedule.map(s => (
            <div key={s.id} className="p-4 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center">
                <div className="text-[10px] uppercase">{s.day.slice(0,3)}</div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{s.type} waste</div>
                <div className="text-xs text-muted-foreground">{s.date} • {s.time}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

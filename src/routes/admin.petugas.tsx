import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockTransporters } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/petugas")({ component: Page });

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Transporter Management" description="Monitor workload and performance" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockTransporters.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-soft transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl bg-gradient-hero text-primary-foreground font-bold flex items-center justify-center shadow-soft">
                {t.name.split(" ").map(n => n[0]).join("").slice(0,2)}
              </div>
              <div>
                <div className="font-display font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.area}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Completion rate</span><span className="font-medium">{t.rate}%</span></div>
                <div className="h-2 bg-muted rounded-full"><div className="h-full bg-success rounded-full" style={{width:`${t.rate}%`}}/></div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg bg-success/10 p-3 text-center">
                  <div className="text-2xl font-bold text-success">{t.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="rounded-lg bg-destructive/10 p-3 text-center">
                  <div className="text-2xl font-bold text-destructive">{t.failed}</div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/schedules")({ component: Page });

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const schedules = [
  { id:1, area:"Ubud", day:"Mon", time:"07:00", type:"Organic", transporter:"Wayan Sutha" },
  { id:2, area:"Ubud", day:"Wed", time:"07:00", type:"Non-organic", transporter:"Wayan Sutha" },
  { id:3, area:"Sanur", day:"Tue", time:"06:30", type:"Organic", transporter:"Komang Aris" },
  { id:4, area:"Denpasar", day:"Fri", time:"08:00", type:"Recyclable", transporter:"Putu Eka" },
];

function Page() {
  return (
    <AppLayout>
      <PageHeader title="Schedule Management" description="Create and assign recurring pickup schedules"
        action={<button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-soft hover:opacity-90"><Plus className="size-4" />New schedule</button>}
      />

      <div className="bg-card border border-border rounded-2xl p-6 shadow-card mb-5">
        <h2 className="font-display font-bold text-lg mb-4">Weekly Overview</h2>
        <div className="grid grid-cols-7 gap-3">
          {DAYS.map(d => {
            const items = schedules.filter(s => s.day === d);
            return (
              <div key={d} className="rounded-xl bg-muted/30 p-3 min-h-32">
                <div className="text-xs font-semibold text-muted-foreground mb-2">{d}</div>
                {items.map(s => (
                  <div key={s.id} className="text-xs bg-card rounded-lg p-2 mb-2 border border-border">
                    <div className="font-medium">{s.area}</div>
                    <div className="text-muted-foreground">{s.type}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="text-left p-4">Area</th><th className="text-left p-4">Day</th><th className="text-left p-4">Time</th><th className="text-left p-4">Type</th><th className="text-left p-4">Transporter</th><th className="text-left p-4"></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedules.map(s => (
              <tr key={s.id} className="hover:bg-muted/30 transition">
                <td className="p-4 font-medium">{s.area}</td>
                <td className="p-4">{s.day}</td>
                <td className="p-4">{s.time}</td>
                <td className="p-4">{s.type}</td>
                <td className="p-4">{s.transporter}</td>
                <td className="p-4"><button className="text-xs text-primary hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

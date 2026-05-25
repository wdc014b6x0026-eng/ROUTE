import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/request")({ component: Page });

function Page() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <AppLayout>
      <PageHeader title="Request Pickup" description="Need an extra pickup or had one missed? Submit a request." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-card">
          {submitted ? (
            <div className="text-center py-12">
              <div className="size-14 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="font-display font-bold text-xl mt-4">Request submitted!</h3>
              <p className="text-muted-foreground text-sm mt-2">We'll review it and get back to you within 2 hours.</p>
              <div className="mt-5"><StatusBadge status="Pending" /></div>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-sm text-primary hover:underline">Submit another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
              <div>
                <label className="text-sm font-medium">Request type</label>
                <select className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                  <option>Extra waste</option>
                  <option>Missed schedule</option>
                  <option>Used cooking oil</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Waste type</label>
                  <select className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                    <option>Organic</option><option>Non-organic</option><option>Recyclable</option><option>Used oil</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated amount</label>
                  <input placeholder="e.g. 5 kg" className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea rows={4} placeholder="Anything we should know?" className="mt-1.5 w-full px-3 py-2 rounded-lg border border-input bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium">Photo (optional)</label>
                <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/40 transition cursor-pointer">
                  <Upload className="size-6 mx-auto text-muted-foreground" />
                  <div className="text-sm mt-2">Click to upload or drag a photo</div>
                  <div className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</div>
                </div>
              </div>
              <button className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition">
                Submit request
              </button>
            </form>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-semibold mb-3">Request lifecycle</h3>
          <ol className="space-y-3 text-sm">
            {[["Pending","Awaiting review"],["Accepted","Approved by transporter"],["Scheduled","Pickup time set"],["Completed","Waste collected"]].map(([s, d], i) => (
              <li key={s} className="flex gap-3">
                <div className="size-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0">{i+1}</div>
                <div>
                  <div className="font-medium">{s}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}

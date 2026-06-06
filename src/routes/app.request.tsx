import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader, StatusBadge } from "@/components/app-layout";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiFetch, type ApiWilayah } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/request")({ component: Page });

const WASTE_TYPES = ["Organik", "Non-organik", "Daur ulang", "Minyak goreng bekas"];

function Page() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wilayahList, setWilayahList] = useState<ApiWilayah[]>([]);

  const [jenisSampah, setJenisSampah] = useState(WASTE_TYPES[0]);
  const [estimasi, setEstimasi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [wilayahId, setWilayahId] = useState(user?.wilayah_id ?? "");

  useEffect(() => {
    apiFetch<ApiWilayah[]>("/wilayah").then(setWilayahList).catch(() => {});
    if (user?.wilayah_id) setWilayahId(user.wilayah_id);
  }, [user?.wilayah_id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await apiFetch("/request", {
        method: "POST",
        body: JSON.stringify({ wilayah_id: wilayahId, jenis_sampah: jenisSampah, estimasi_jumlah: estimasi, catatan }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Gagal mengirim request.");
    } finally {
      setLoading(false);
    }
  };

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
              <button onClick={() => { setSubmitted(false); setEstimasi(""); setCatatan(""); }}
                className="mt-6 text-sm text-primary hover:underline">Submit another</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="text-sm font-medium">Waste type</label>
                <select value={jenisSampah} onChange={e => setJenisSampah(e.target.value)}
                  className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                  {WASTE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Estimated amount</label>
                <input required value={estimasi} onChange={e => setEstimasi(e.target.value)}
                  placeholder="e.g. 5 kg" className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background" />
              </div>
              {!user?.wilayah_id && (
                <div>
                  <label className="text-sm font-medium">Area</label>
                  <select value={wilayahId} onChange={e => setWilayahId(e.target.value)}
                    className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background">
                    <option value="">Select area…</option>
                    {wilayahList.map(w => <option key={w.id} value={w.id}>{w.nama_wilayah} — {w.kecamatan}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea rows={4} value={catatan} onChange={e => setCatatan(e.target.value)}
                  placeholder="Anything we should know?"
                  className="mt-1.5 w-full px-3 py-2 rounded-lg border border-input bg-background" />
              </div>
              {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Submit request"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-semibold mb-3">Request lifecycle</h3>
          <ol className="space-y-3 text-sm">
            {[["Pending", "Awaiting review"], ["Accepted", "Approved by transporter"], ["Scheduled", "Pickup time set"], ["Completed", "Waste collected"]].map(([s, d], i) => (
              <li key={s} className="flex gap-3">
                <div className="size-6 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center shrink-0">{i + 1}</div>
                <div><div className="font-medium">{s}</div><div className="text-xs text-muted-foreground">{d}</div></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}

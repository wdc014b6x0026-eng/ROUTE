import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { ArrowRight, Home, Truck, MapPin, Loader2 } from "lucide-react";
import { useAuth, dashboardPath } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { apiFetch, type ApiWilayah } from "@/lib/api";

const AddressPickerMap = lazy(() =>
  import("@/components/leaflet-map").then((m) => ({ default: m.AddressPickerMap }))
);

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("resident");
  const [address, setAddress] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [wilayahId, setWilayahId] = useState("");
  const [wilayahList, setWilayahList] = useState<ApiWilayah[]>([]);
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<ApiWilayah[]>("/wilayah")
      .then(setWilayahList)
      .catch(() => {});
  }, []);

  const handleCoords = (la: number, lo: number) => {
    setLat(la); setLng(lo);
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${la}&lon=${lo}&format=json`)
      .then(r => r.json())
      .then(d => { if (d?.display_name) setAddress(d.display_name); })
      .catch(() => setAddress(`${la.toFixed(5)}, ${lo.toFixed(5)}`));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const u = await register(name, email, password, role, address, noTelepon, wilayahId || undefined, lat, lng);
      nav({ to: dashboardPath(u.role) });
    } catch (err: any) {
      setError(err.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-soft">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src="/logo-full.png" alt="ROUTE" className="h-10 w-auto" />
        </Link>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join ROUTE and start coordinating smarter</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {/* Role selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "resident" as Role, label: "Resident", desc: "I want pickups", icon: Home },
                  { v: "transporter" as Role, label: "Transport Worker", desc: "I collect waste", icon: Truck },
                ].map(o => {
                  const active = role === o.v;
                  return (
                    <button key={o.v} type="button" onClick={() => setRole(o.v)}
                      className={cn("text-left rounded-xl p-4 border-2 transition",
                        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                      <o.icon className={cn("size-5 mb-2", active ? "text-primary" : "text-muted-foreground")} />
                      <div className="font-medium text-sm">{o.label}</div>
                      <div className="text-xs text-muted-foreground">{o.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} required
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>

            <div>
              <label className="text-sm font-medium">Phone number</label>
              <input type="tel" value={noTelepon} onChange={e => setNoTelepon(e.target.value)}
                placeholder="e.g. 08123456789"
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>

            {/* Wilayah dropdown */}
            <div>
              <label className="text-sm font-medium">Area / Wilayah</label>
              <select value={wilayahId} onChange={e => setWilayahId(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none">
                <option value="">Select your area…</option>
                {wilayahList.map(w => (
                  <option key={w.id} value={w.id}>{w.nama_wilayah} — {w.kecamatan}, {w.kota}</option>
                ))}
              </select>
            </div>

            {/* Address + map picker */}
            <div>
              <label className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-1">(used for pickup identification)</span>
              </label>
              <div className="mt-1.5 flex gap-2">
                <input value={address} onChange={e => setAddress(e.target.value)} required
                  placeholder="e.g. Jl. Raya Ubud No. 12, Ubud, Gianyar"
                  className="flex-1 h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none text-sm" />
                <button type="button" onClick={() => setShowMap(!showMap)}
                  className={cn("h-11 px-3 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition",
                    showMap ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>
                  <MapPin className="size-4" />{lat ? "Pinned" : "Pin"}
                </button>
              </div>
              {showMap && (
                <div className="mt-3 rounded-xl overflow-hidden border border-border shadow-inner">
                  <div className="bg-muted/60 px-3 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3" />Click on the map to pin your location.
                  </div>
                  <Suspense fallback={<div className="h-64 flex items-center justify-center bg-muted/30"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>}>
                    <AddressPickerMap lat={lat} lng={lng} onChange={handleCoords} className="h-64 w-full" />
                  </Suspense>
                  {lat && (
                    <div className="bg-success/10 border-t border-success/20 px-3 py-1.5 text-xs text-success flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-success inline-block" />
                      Pinned at {lat.toFixed(5)}, {lng?.toFixed(5)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <><span>Create account</span><ArrowRight className="size-4" /></>}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ArrowRight, Home, Truck } from "lucide-react";
import { useAuth, dashboardPath } from "@/lib/auth";
import type { Role } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("resident");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = register(name || "New User", email, role);
    nav({ to: dashboardPath(u.role) });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-soft">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
            <Leaf className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">ROUTE</span>
        </Link>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join ROUTE and start coordinating smarter</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "resident" as Role, label: "Resident", desc: "I want pickups", icon: Home },
                  { v: "transporter" as Role, label: "Transport Worker", desc: "I collect waste", icon: Truck },
                ].map((o) => {
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
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>
            <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition flex items-center justify-center gap-2">
              Create account <ArrowRight className="size-4" />
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

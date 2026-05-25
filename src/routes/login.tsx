import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ArrowRight } from "lucide-react";
import { useAuth, dashboardPath } from "@/lib/auth";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("warga@route.id");
  const [password, setPassword] = useState("demo1234");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email, password);
    nav({ to: dashboardPath(u.role) });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-soft">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
            <Leaf className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">ROUTE</span>
        </Link>
        <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your ROUTE account</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <a className="text-xs text-primary hover:underline cursor-pointer">Forgot?</a>
              </div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none" />
            </div>
            <button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition flex items-center justify-center gap-2">
              Sign in <ArrowRight className="size-4" />
            </button>
          </form>
          <div className="mt-5 rounded-xl bg-muted/50 p-3 text-xs space-y-1">
            <div className="font-medium">Demo accounts (any password):</div>
            <div className="text-muted-foreground">• <code>warga@route.id</code> — Resident</div>
            <div className="text-muted-foreground">• <code>petugas@route.id</code> — Transporter</div>
            <div className="text-muted-foreground">• <code>admin@route.id</code> — Admin</div>
          </div>
          <p className="text-sm text-center mt-6 text-muted-foreground">
            New to ROUTE? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

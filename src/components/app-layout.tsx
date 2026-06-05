import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Calendar, Truck, PlusCircle, History, BookOpen, Megaphone, User,
  Users, ClipboardList, MapPin, Map, FileText, LogOut, Menu, X, Leaf, Bell, Activity, ListChecks,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const NAVS: Record<string, Item[]> = {
  resident: [
    { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/schedule", label: "Schedule", icon: Calendar },
    { to: "/app/status", label: "Pickup Status", icon: Truck },
    { to: "/app/request", label: "Request Pickup", icon: PlusCircle },
    { to: "/app/history", label: "History", icon: History },
    { to: "/education", label: "Education", icon: BookOpen },
    { to: "/announcements", label: "Announcements", icon: Megaphone },
    { to: "/app/profile", label: "Profile", icon: User },
  ],
  transporter: [
    { to: "/petugas/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/petugas/jadwal-hari-ini", label: "Today Schedule", icon: ListChecks },
    { to: "/petugas/request", label: "Requests", icon: ClipboardList },
    { to: "/petugas/status", label: "Update Status", icon: Activity },
    { to: "/petugas/history", label: "History", icon: History },
    { to: "/announcements", label: "Announcements", icon: Megaphone },
    { to: "/petugas/profile", label: "Profile", icon: User },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/schedules", label: "Schedules", icon: Calendar },
    { to: "/admin/requests", label: "Requests", icon: ClipboardList },
    { to: "/admin/petugas", label: "Transporters", icon: Map },
    { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { to: "/admin/education", label: "Education", icon: FileText },
    { to: "/admin/profile", label: "Profile", icon: User },
  ],
};

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);

  if (!user) {
    if (typeof window !== "undefined") nav({ to: "/login" });
    return null;
  }

  const items = NAVS[user.role];
  const roleLabel = user.role === "resident" ? "Resident" : user.role === "transporter" ? "Transporter" : "Admin";
  const roleColor =
    user.role === "admin" ? "bg-info/15 text-info"
    : user.role === "transporter" ? "bg-warning/15 text-warning"
    : "bg-success/15 text-success";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-5 flex items-center justify-between">
          <Link to="/">
            <img src="/logo-full.png" alt="ROUTE" className="h-10 w-auto" />
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-muted-foreground">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-3 mb-2">
          <div className="px-3 py-2.5 rounded-xl bg-sidebar-accent/60 flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user.name.split(" ").map(n => n[0]).join("").slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <span className={cn("inline-block text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide", roleColor)}>{roleLabel}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => { logout(); nav({ to: "/" }); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border h-16 flex items-center px-4 lg:px-8 gap-4">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2">
            <Menu className="size-5" />
          </button>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Welcome back</div>
            <div className="font-medium text-sm">{user.name}</div>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-muted transition">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary"></span>
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = "primary", hint }: {
  label: string; value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "warning" | "info" | "success" | "destructive";
  hint?: string;
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/10 text-info",
    success: "bg-success/15 text-success",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-card hover:shadow-soft transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="mt-2 text-3xl font-bold font-display">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={cn("size-10 rounded-xl flex items-center justify-center", colorMap[accent])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s.includes("complet") || s === "picked_up" || s === "active" ? "bg-success/15 text-success"
    : s.includes("on_the_way") || s.includes("on the way") || s === "accepted" || s === "scheduled" ? "bg-info/15 text-info"
    : s.includes("pending") || s === "arrived" ? "bg-warning/15 text-warning"
    : s.includes("fail") || s.includes("reject") ? "bg-destructive/15 text-destructive"
    : "bg-muted text-muted-foreground";
  return <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize", cls)}>{status.replace(/_/g, " ")}</span>;
}

import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { lazy, Suspense, useState } from "react";
import { mockAllUsers } from "@/lib/mock-data";
import { MapPin, Loader2, Users, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MapMarker } from "@/components/leaflet-map";

const LeafletMap = lazy(() =>
  import("@/components/leaflet-map").then((m) => ({ default: m.LeafletMap }))
);

export const Route = createFileRoute("/admin/map")({ component: Page });

type Filter = "all" | "resident" | "transporter";

function Page() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const usersWithCoords = mockAllUsers.filter(
    (u) => u.lat != null && u.lng != null
  );

  const filtered = usersWithCoords.filter((u) => {
    const roleMatch =
      filter === "all" ||
      (filter === "resident" && u.role === "Resident") ||
      (filter === "transporter" && u.role === "Transporter");
    const searchMatch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.address ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.area.toLowerCase().includes(search.toLowerCase());
    return roleMatch && searchMatch;
  });

  const markers: MapMarker[] = filtered.map((u) => ({
    id: u.id,
    lat: u.lat!,
    lng: u.lng!,
    label: u.name,
    sublabel: `${u.role} · ${u.address}`,
    color: u.role === "Transporter" ? "orange" : "blue",
  }));

  const counts = {
    residents: usersWithCoords.filter((u) => u.role === "Resident").length,
    transporters: usersWithCoords.filter((u) => u.role === "Transporter").length,
  };

  return (
    <AppLayout>
      <PageHeader
        title="User Map"
        description="Geographic overview of all registered residents and transport workers"
      />

      <div className="space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "All Users", value: usersWithCoords.length, icon: Users, active: filter === "all", f: "all" as Filter },
            { label: "Residents", value: counts.residents, icon: Home, active: filter === "resident", f: "resident" as Filter },
            { label: "Transporters", value: counts.transporters, icon: Truck, active: filter === "transporter", f: "transporter" as Filter },
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setFilter(s.f)}
              className={cn(
                "bg-card border rounded-xl p-3 text-center shadow-card transition",
                s.active ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-center mb-1">
                <s.icon className={cn("size-4", s.active ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className={cn("text-xl font-bold", s.active ? "text-primary" : "text-foreground")}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, address, or zone…"
          className="w-full h-10 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none text-sm"
        />

        {/* Map */}
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-primary" />
              {filtered.length} user{filtered.length !== 1 ? "s" : ""} shown
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-blue-500 inline-block" /> Residents
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-orange-400 inline-block" /> Transporters
              </span>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="h-[420px] flex items-center justify-center bg-muted/30">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            {filtered.length > 0 ? (
              <LeafletMap
                markers={markers}
                className="h-[420px] w-full"
                zoom={12}
              />
            ) : (
              <div className="h-[420px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                <MapPin className="size-8 opacity-30" />
                <p className="text-sm">No users match your filter</p>
              </div>
            )}
          </Suspense>
        </div>

        {/* User list */}
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-sm font-medium">User Index</div>
          <div className="divide-y divide-border max-h-80 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">No results</div>
            )}
            {filtered.map((u) => (
              <div key={u.id} className="px-4 py-3 flex items-center gap-3">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    u.role === "Transporter"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                  )}
                >
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.address} · {u.area}</div>
                </div>
                <div
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                    u.status === "Active"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  )}
                >
                  {u.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

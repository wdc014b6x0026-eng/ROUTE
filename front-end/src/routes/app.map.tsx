import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { lazy, Suspense } from "react";
import { useAuth } from "@/lib/auth";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

const LeafletMap = lazy(() =>
  import("@/components/leaflet-map").then((m) => ({ default: m.LeafletMap }))
);

export const Route = createFileRoute("/app/map")({ component: Page });

function Page() {
  const { user } = useAuth();

  const markers =
    user?.lat && user?.lng
      ? [
          {
            id: user.id,
            lat: user.lat,
            lng: user.lng,
            label: user.name,
            sublabel: user.address ?? "Your registered address",
            color: "green" as const,
            pulse: false,
          },
        ]
      : [];

  return (
    <AppLayout>
      <PageHeader
        title="My Location"
        description="Your registered address used for waste pickup coordination"
      />

      {!user?.lat ? (
        <div className="bg-warning/10 border border-warning/30 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="size-5 text-warning shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">No address pinned yet</div>
            <p className="text-sm text-muted-foreground mt-1">
              You haven't pinned a location. Update your profile or re-register with a pinned address so the transport team can find you.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-card flex items-start gap-4">
            <div className="size-11 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
              <MapPin className="size-5 text-success" />
            </div>
            <div>
              <div className="font-semibold">{user.name}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{user.address ?? "Registered address"}</div>
              {user.area && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Zone: {user.area}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2 text-sm font-medium">
              <MapPin className="size-4 text-primary" /> Pinned Location
            </div>
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center bg-muted/30">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <LeafletMap
                markers={markers}
                center={[user.lat!, user.lng!]}
                zoom={16}
                className="h-96 w-full"
              />
            </Suspense>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This is the location shared with your assigned transporter. To update it, edit your profile.
          </p>
        </div>
      )}
    </AppLayout>
  );
}

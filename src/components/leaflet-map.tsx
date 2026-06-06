/**
 * LeafletMap — thin wrapper around Leaflet that plays nicely with SSR/Vite.
 * Import lazily in routes so Leaflet only loads client-side.
 */
import { useEffect, useRef } from "react";
import type { Map as LMap, Marker as LMarker } from "leaflet";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sublabel?: string;
  color?: "green" | "blue" | "orange" | "red" | "purple";
  /** If true, shows a pulsing ring (e.g. "on the way") */
  pulse?: boolean;
};

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  /** Draw a dashed polyline connecting markers in order */
  showRoute?: boolean;
}

// Colour lookup — we create SVG circle pins for each colour
const COLORS: Record<string, { fill: string; stroke: string }> = {
  green:  { fill: "#22c55e", stroke: "#15803d" },
  blue:   { fill: "#3b82f6", stroke: "#1d4ed8" },
  orange: { fill: "#f97316", stroke: "#c2410c" },
  red:    { fill: "#ef4444", stroke: "#b91c1c" },
  purple: { fill: "#a855f7", stroke: "#7e22ce" },
};

function makeSvgIcon(color: string, pulse: boolean) {
  const c = COLORS[color] ?? COLORS.blue;
  // We build a simple teardrop/pin SVG
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
  ${pulse ? `<circle cx="16" cy="16" r="14" fill="${c.fill}" opacity="0.25">
    <animate attributeName="r" from="10" to="20" dur="1.4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="0.4" to="0" dur="1.4s" repeatCount="indefinite"/>
  </circle>` : ""}
  <path d="M16 2 C8.268 2 2 8.268 2 16 C2 24.837 16 40 16 40 C16 40 30 24.837 30 16 C30 8.268 23.732 2 16 2Z"
    fill="${c.fill}" stroke="${c.stroke}" stroke-width="2"/>
  <circle cx="16" cy="16" r="5" fill="white" opacity="0.9"/>
</svg>`;
  return svg;
}

export function LeafletMap({
  markers,
  center,
  zoom = 14,
  className = "",
  showRoute = false,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const markersRef = useRef<LMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamic import — keeps Leaflet out of SSR bundle
    import("leaflet").then((L) => {
      // Fix default icon URLs broken by Vite bundling
      // We use our own SVG icons, so we just need the CSS
      if (!document.querySelector("link[href*='leaflet.css']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const defaultCenter: [number, number] =
        center ??
        (markers.length > 0
          ? [
              markers.reduce((s, m) => s + m.lat, 0) / markers.length,
              markers.reduce((s, m) => s + m.lng, 0) / markers.length,
            ]
          : [-8.5069, 115.2625]); // Ubud fallback

      const map = L.map(containerRef.current!, {
        center: defaultCenter,
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Polyline route
      if (showRoute && markers.length > 1) {
        const latlngs = markers.map((m) => [m.lat, m.lng] as [number, number]);
        L.polyline(latlngs, {
          color: "#22c55e",
          weight: 3,
          dashArray: "6 6",
          opacity: 0.8,
        }).addTo(map);
      }

      // Add markers
      markers.forEach((m) => {
        const color = m.color ?? "blue";
        const svgString = makeSvgIcon(color, !!m.pulse);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const icon = L.icon({
          iconUrl: url,
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -44],
        });

        const marker = L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:140px">
              <div style="font-weight:600;font-size:13px">${m.label}</div>
              ${m.sublabel ? `<div style="font-size:11px;color:#666;margin-top:2px">${m.sublabel}</div>` : ""}
            </div>`,
            { closeButton: false }
          );

        markersRef.current.push(marker);
      });

      // Fit bounds when multiple markers
      if (markers.length > 1) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.2));
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ background: "#e5e3df" }}
    />
  );
}

/** Standalone address-picker map for registration.
 *  Click anywhere on the map to pick a location; returns lat/lng to parent.
 */
interface AddressPickerMapProps {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

export function AddressPickerMap({ lat, lng, onChange, className = "" }: AddressPickerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const markerRef = useRef<LMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      if (!document.querySelector("link[href*='leaflet.css']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const initCenter: [number, number] = lat && lng ? [lat, lng] : [-8.5069, 115.2625];

      const map = L.map(containerRef.current!, {
        center: initCenter,
        zoom: 15,
        zoomControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const svgString = makeSvgIcon("green", false);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const icon = L.icon({ iconUrl: url, iconSize: [32, 42], iconAnchor: [16, 42], popupAnchor: [0, -44] });

      // Place initial marker if coords provided
      if (lat && lng) {
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      }

      map.on("click", (e) => {
        const { lat: clat, lng: clng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([clat, clng]);
        } else {
          markerRef.current = L.marker([clat, clng], { icon }).addTo(map);
        }
        onChange(clat, clng);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ background: "#e5e3df" }}
    />
  );
}

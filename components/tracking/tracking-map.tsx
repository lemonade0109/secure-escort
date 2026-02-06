"use client";

import React from "react";
import dynamic from "next/dynamic";
import { setupLeafletIconFix } from "./leaflet-icon-fix";
import { useUserLiveTracking } from "./use-user-live-tracking";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);

function ageLabel(date: Date) {
  const t = new Date(date).getTime();
  if (!Number.isFinite(t)) return "";
  const diff = Date.now() - t;
  const sec = Math.max(0, Math.floor(diff / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export default function TrackingMap({
  requestId,
  status,
  height = 340,
}: {
  requestId: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  height?: number;
}) {
  React.useEffect(() => {
    setupLeafletIconFix();
  }, []);

  // only track when service actually starts
  const trackingEnabled = status === "IN_PROGRESS";

  // your hook returns the latest ping (pos)
  const pos = useUserLiveTracking(requestId, 15000, trackingEnabled);

  const lat = pos ? Number(pos.lat) : NaN;
  const lng = pos ? Number(pos.lng) : NaN;
  const hasValidPos = Number.isFinite(lat) && Number.isFinite(lng);

  const center: [number, number] = hasValidPos ? [lat, lng] : [6.5244, 3.3792]; // Lagos fallback

  const accuracy =
    pos?.accuracyM && Number.isFinite(Number(pos.accuracyM))
      ? Math.max(20, Math.round(Number(pos.accuracyM)))
      : null;

  // ✅ trail (polyline) built locally from incoming positions
  const [trail, setTrail] = React.useState<[number, number][]>([]);

  React.useEffect(() => {
    // reset trail when request changes or when tracking stops
    setTrail([]);
  }, [requestId, trackingEnabled]);

  React.useEffect(() => {
    if (!hasValidPos) return;

    setTrail((prev) => {
      const next: [number, number] = [lat, lng];
      const last = prev[prev.length - 1];

      // ignore duplicates
      if (last && last[0] === next[0] && last[1] === next[1]) return prev;

      // keep last 50 points to avoid huge UI
      const updated = [...prev, next];
      return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
    });
  }, [lat, lng, hasValidPos]);

  const mapRef = React.useRef<L.Map>(null);

  React.useEffect(() => {
    if (mapRef.current && hasValidPos) {
      // setView avoids the "map stays where it started" problem
      mapRef.current.setView([lat, lng], 16, { animate: true });
    }
  }, [lat, lng, hasValidPos]);

  const updatedAt = pos?.createdAt instanceof Date ? pos.createdAt : null;

  return (
    <div className="overflow-hidden border rounded-2xl border-white/10 bg-white/3 backdrop-blur-xl">
      <div style={{ height }}>
        <MapContainer
          center={center}
          zoom={hasValidPos ? 16 : 11}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={"© OpenStreetMap contributors"}
          />

          {/* trail */}
          {trail.length >= 2 ? (
            <Polyline
              positions={trail}
              pathOptions={{
                color: "gold",
                weight: 4,
                opacity: 0.85,
              }}
            />
          ) : null}

          {hasValidPos ? (
            <>
              <Marker position={[lat, lng]} />

              {accuracy ? (
                <Circle
                  center={[lat, lng]}
                  radius={accuracy}
                  pathOptions={{
                    color: "gold",
                    fillOpacity: 0.12,
                  }}
                />
              ) : null}
            </>
          ) : null}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#070a12]/60 px-4 py-3">
        <div className="text-xs text-white/70">
          {trackingEnabled ? (
            hasValidPos && updatedAt ? (
              <>
                Live location updated{" "}
                <span className="text-white/90">{ageLabel(updatedAt)}</span>
              </>
            ) : (
              "Waiting for guard GPS..."
            )
          ) : status === "ASSIGNED" ? (
            "Tracking starts when guard begins the job."
          ) : status === "COMPLETED" ? (
            "Job completed. Tracking closed."
          ) : status === "CANCELLED" ? (
            "Request cancelled. Tracking closed."
          ) : (
            "Tracking will appear once assigned and started."
          )}
        </div>

        {accuracy ? (
          <div className="text-xs text-white/70">
            Accuracy: <span className="text-white/80">{accuracy}m</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

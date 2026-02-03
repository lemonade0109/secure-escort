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

  const trackingEnabled = status === "IN_PROGRESS";

  const pos = useUserLiveTracking(requestId, 15000, trackingEnabled);

  const lat = pos ? Number(pos.lat) : NaN;
  const lng = pos ? Number(pos.lng) : NaN;
  const hasValidPos = Number.isFinite(lat) && Number.isFinite(lng);

  const center: [number, number] = hasValidPos ? [lat, lng] : [6.5244, 3.3792]; // Default to Lagos, Nigeria

  const accuracy =
    pos?.accuracyM && Number.isFinite(Number(pos.accuracyM))
      ? Math.max(20, Math.round(Number(pos.accuracyM)))
      : null;

  return (
    <div className="overflow-hidden border rounded-2xl border-white/10 bg-white/3 backdrop-blur-xl">
      <div style={{ height }}>
        <MapContainer
          center={center}
          zoom={hasValidPos ? 16 : 11}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={`&copy; OpenStreetMap contributors`}
          />

          {hasValidPos ? (
            <>
              <Marker position={[lat, lng]} />

              {accuracy && (
                <Circle
                  center={[lat, lng]}
                  radius={accuracy}
                  pathOptions={{
                    color: "gold",
                    fillOpacity: 0.12,
                  }}
                />
              )}
            </>
          ) : null}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#070a12]/60 px-4 py-3">
        <div className="text-xs text-white/70">
          {hasValidPos && pos ? (
            <>
              Live Location updated{" "}
              <span className="text-white/90">
                {new Date(pos.createdAt as Date).toLocaleTimeString()}
              </span>
            </>
          ) : (
            "Waiting for guard to start tracking..."
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

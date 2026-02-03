"use client";

import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export async function setupLeafletIconFix() {
  const L = (await import("leaflet")).default;

  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
    ._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
  });
}

"use client";

import React from "react";
import { createTrackingPingAction } from "@/lib/actions/tracking/create-tracking-ping";

type Options = {
  requestId: string;
  intervalMs?: number;
};

export function useLiveTracking({ requestId, intervalMs = 15000 }: Options) {
  const [isRunning, setIsRunning] = React.useState(false);
  const watchIdRef = React.useRef<number | null>(null);
  const lastSentRef = React.useRef<number>(0);

  const stop = React.useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = React.useCallback(() => {
    if (!("geolocation" in navigator)) return;

    setIsRunning(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - lastSentRef.current < intervalMs) return;
        lastSentRef.current = now;

        const fd = new FormData();
        fd.set("requestId", requestId);
        fd.set("lat", String(pos.coords.latitude));
        fd.set("lng", String(pos.coords.longitude));
        if (pos.coords.accuracy != null)
          fd.set("accuracyM", String(Math.round(pos.coords.accuracy)));
        if (pos.coords.speed != null)
          fd.set("speedMps", String(pos.coords.speed));
        if (pos.coords.heading != null)
          fd.set("heading", String(pos.coords.heading));

        // call server action quietly
        await createTrackingPingAction({ success: false, message: "" }, fd);
      },
      () => {
        // permission denied or error
        stop();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 12000,
      },
    );
  }, [requestId, intervalMs, stop]);

  React.useEffect(() => () => stop(), [stop]);

  return { isRunning, start, stop };
}

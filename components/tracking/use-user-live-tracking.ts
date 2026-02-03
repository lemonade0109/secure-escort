"use client";

import React from "react";
import { getTrackingFeedAction } from "@/lib/actions/tracking/get-tracking-feed";

type Position = {
  lat: number;
  lng: number;
  createdAt: Date | null;
  accuracyM?: number | null;
  heading?: number | null;
  speedMps?: number | null;
};

export function useUserLiveTracking(
  requestId: string,
  intervalMs = 15000,
  enabled = true,
) {
  const [pos, setPos] = React.useState<Position | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      setPos(null);
      return;
    }

    let alive = true;
    const tick = async () => {
      try {
        const feed = await getTrackingFeedAction(requestId);
        if (!alive) return;

        if (
          feed?.latest &&
          feed.latest.lat !== null &&
          feed.latest.lng !== null
        ) {
          setPos({
            lat: feed.latest.lat,
            lng: feed.latest.lng,
            createdAt: feed.latest.createdAt,
            accuracyM: feed.latest.accuracyM,
            heading: feed.latest.heading,
            speedMps: feed.latest.speedMps,
          });
        }
      } catch (error) {
        console.error("Failed to fetch tracking feed:", error);
      }
    };

    tick();
    const interval = setInterval(tick, intervalMs);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [requestId, intervalMs, enabled]);

  return pos;
}

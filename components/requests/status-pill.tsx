import React from "react";

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const s = String(status || " ").toUpperCase();
  const map: Record<string, string> = {
    PENDING: "border-white/15 bg-white/5 text-white/80",
    STATUS_CHANGED: "border-white/15 bg-white/5 text-white/80",
    ETA_UPDATED: "border-white/15 bg-white/5 text-white/80",
    NOTE_ADDED: "border-white/15 bg-white/5 text-white/80",
    ASSIGNED: "border-gold/30 bg-gold/10 text-gold",
    GUARD_ASSIGNED: "border-gold/30 bg-gold/10 text-gold",
    IN_PROGRESS: "border-blue-400/30 bg-green-400/10 text-white/80",
    TRACKING_ACTIVATED: "border-blue-400/30 bg-green-400/10 text-white/80",
    COMPLETED: "border-green-400/30 bg-green-400/10 text-green-400",
    CANCELLED: "border-red-400/30 bg-red-400/10 text-red-400",
  };

  const cls = map[s] || "border-white/15 bg-white/5 text-white/80";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${cls}`}
    >
      {s.replaceAll("_", " ")}
    </span>
  );
};

export default StatusPill;

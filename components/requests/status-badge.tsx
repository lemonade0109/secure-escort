import React from "react";

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = String(status || " ").toUpperCase();

  const styles =
    s === "COMPLETED"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : s === "IN_PROGRESS"
        ? "border-sky-400/30 bg-sky-400/10 text-sky-200"
        : s === "ASSIGNED"
          ? "border-gold/40 bg-gold/10 text-gold"
          : s === "CANCELLED"
            ? "border-red-400/30 bg-red-400/10 text-red-200"
            : "border-white/15 bg-white/5 text-white/80";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 text-xs font-medium ${styles}`}
    >
      {s.replaceAll("_", " ")}
    </span>
  );
};

export default StatusBadge;

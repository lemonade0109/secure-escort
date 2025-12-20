import { cn } from "@/lib/utils";
import React from "react";

const CinematicCardV2 = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6",
        "bg-linear-to-b from-white/8 to-black/40",
        "border border-white/10",
        "shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]",
        "backdrop-blur-md",
        "overflow-hidden",
        className
      )}
    >
      {/* glow  */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0, rgba(255,255,255,0.08), transparent_55%)]" />

      {/* edge highlight */}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />

      <div className="">{children}</div>
    </div>
  );
};

export default CinematicCardV2;

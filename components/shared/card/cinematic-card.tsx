import React from "react";
import { cn } from "@/lib/utils";

export function CinematicCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10",
        "bg-linear-to-b from-white/8 to-white/3 backdrop-blur-xl",
        "shadow-[0_20px_60px_rgba(0,0,0,0.55)] transition",
        "hover:border-white/20",
        // glow
        "before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-[radial-gradient(circle_at_30%_20%,rgba(212,160,23,0.18),transparent_55%)]",
        "before:opacity-0 hover:before:opacity-100 before:transition",
        className
      )}
    >
      {/* top highlight line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-gold/60 to-transparent" />
      <div className="p-6">{children}</div>
    </div>
  );
}

export default CinematicCard;

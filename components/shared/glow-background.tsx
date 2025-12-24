import { GlowBackgroundProps } from "@/types";
import React from "react";

const glowMap = {
  soft: "rgba(212,160,23,0.12)",
  medium: "rgba(212,160,23,0.24)",
  strong: "rgba(212,160,23,0.36)",
};

const GlowBackground = ({ intensity = "medium" }: GlowBackgroundProps) => {
  return (
    <div
      aria-hidden
      style={{
        background: `radial-gradient(80% 50% at 50% 0%, ${glowMap[intensity]}, transparent 65% )`,
      }}
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
};

export default GlowBackground;

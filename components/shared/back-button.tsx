"use client";
import { BackButtonProps } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const BackButton: React.FC<BackButtonProps> = ({
  fallbackHref,
  label = "Back",
  className = "",
}) => {
  const router = useRouter();
  return (
    <Button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={`text-xs text-white/70 hover:text-white transition ${className}`}
    >
      <span>←</span> {label}
    </Button>
  );
};

export default BackButton;

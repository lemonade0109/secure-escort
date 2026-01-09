"use client";
import React from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = React.useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={onCopy}
      className="border-white/15 bg-white/3 hover:text-white/90 text-white hover:bg-white/6"
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
};

export default CopyButton;

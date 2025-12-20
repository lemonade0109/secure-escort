import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CardActionButton = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="mt-6 border-t border-white/10 pt-4">
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors rounded-md px-3 py-2",
          className
        )}
      >
        {children}
      </Link>
    </div>
  );
};

export default CardActionButton;

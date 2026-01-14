"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Completed", value: "COMPLETED" },
];

const TYPES = [
  { label: "All Types", value: "ALL" },
  { label: "Personal", value: "PERSONAL_SECURITY" },
  { label: "Escort", value: "ESCORT" },
  { label: "Delivery", value: "DELIVERY" },
];

export default function AdminRequestsToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const status = sp.get("status") || "";
  const typeParam = sp.get("type") || "";
  const q = sp.get("q") || "";

  const typeValue = typeParam ? typeParam : "ALL";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());

    if (!value || value === "ALL") params.delete(key);
    else params.set(key, value);

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function reset() {
    router.push(pathname);
  }

  return (
    <div className="space-y-4">
      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS.map((s) => {
          const active = (status || "") === s.value;
          return (
            <Button
              key={s.label}
              variant={active ? "default" : "outline"}
              className={
                active
                  ? "bg-gold text-black hover:bg-gold/90"
                  : "border-white/15 bg-white/3 text-white hover:text-white/70 hover:bg-white/6"
              }
              onClick={() => setParam("status", s.value)}
              type="button"
            >
              {s.label}
            </Button>
          );
        })}
      </div>

      {/* Type + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Type Select */}
        <Select value={typeValue} onValueChange={(v) => setParam("type", v)}>
          <SelectTrigger className="text-white w-45 border-white/15 bg-white/3">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>

          <SelectContent>
            {TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <Input
          value={q}
          onChange={(e) => setParam("q", e.target.value)}
          placeholder="Search tracking code…"
          className="text-white border-white/15 bg-white/3 placeholder:text-white/40"
        />

        <Button
          type="button"
          variant="outline"
          onClick={reset}
          className="text-white border-white/15 bg-white/3 hover:text-white/70 hover:bg-white/6"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TYPE_OPTIONS = [
  { value: "ALL", label: "All types" },
  { value: "STATUS_CHANGED", label: "Status changed" },
  { value: "GUARD_ASSIGNED", label: "Guard assigned" },
  { value: "ETA_UPDATED", label: "ETA updated" },
  { value: "CHECKPOINT_ADDED", label: "Checkpoint added" },
  { value: "REQUEST_CANCELLED", label: "Request cancelled" },
];

const ROLE_OPTIONS = [
  { value: "ALL", label: "All actors" },
  { value: "ADMIN", label: "Admin" },
  { value: "GUARD", label: "Guard" },
  { value: "USER", label: "User" },
  { value: "SYSTEM", label: "System" },
];

export default function AdminAuditToolbar() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [type, setType] = React.useState(sp.get("type") ?? "ALL");
  const [actorRole, setActorRole] = React.useState(
    sp.get("actorRole") ?? "ALL",
  );

  function apply() {
    const params = new URLSearchParams(sp.toString());
    params.set("page", "1");

    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");

    if (type !== "ALL") params.set("type", type);
    else params.delete("type");

    if (actorRole !== "ALL") params.set("actorRole", actorRole);
    else params.delete("actorRole");

    router.push(`/admin/audit?${params.toString()}`);
  }

  function clear() {
    setQ("");
    setType("ALL");
    setActorRole("ALL");
    router.push("/admin/audit");
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tracking code, request id, actor, message..."
          className="w-full text-white bg-white/3 border-white/10 placeholder:text-white/40 sm:w-96"
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full text-white bg-white/3 border-white/10 sm:w-56">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={actorRole} onValueChange={setActorRole}>
          <SelectTrigger className="w-full text-white bg-white/3 border-white/10 sm:w-48">
            <SelectValue placeholder="Actor" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={apply} className="text-black bg-gold hover:bg-gold/90">
          Apply
        </Button>
        <Button
          variant="outline"
          onClick={clear}
          className="text-white border-white/15 bg-white/3 hover:bg-white/6 hover:text-white/90"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

"use client";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AdminGuardsToolbar: React.FC<{
  defaultQ: string;
  defaultActive: string;
}> = ({ defaultQ, defaultActive }) => {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = React.useState(defaultQ ?? "");
  const [active, setActive] = React.useState(defaultActive ?? "ALL");

  function apply(nextQ: string, nextActive: string) {
    const params = new URLSearchParams(sp.toString());
    if (nextQ.trim()) params.set("q", nextQ.trim());
    else params.delete("q");

    if (nextActive && nextActive !== "ALL") params.set("active", nextActive);
    else params.delete("active");

    const queryString = params.toString();
    router.push(queryString ? `/admin/guards?${queryString}` : "/admin/guards");
  }
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center flex-1 gap-2">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-white/50" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, badge, phone.."
            className="text-white pl-9 bg-white/3 border-white/10 placeholder:text-white/50"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="text-black border-black bg-gold hover:bg-gold/90"
          onClick={() => apply(q, active)}
        >
          Search
        </Button>

        <Button
          type="button"
          variant="outline"
          className="text-white border-white/15 bg-white/3 hover:bg-white/6 hover:text-white/90"
          onClick={() => {
            setQ("");
            setActive("ALL");
            router.push("/admin/guards");
          }}
        >
          <X className="mr-1 size-4" />
          Reset
        </Button>
      </div>

      <div className="w-full md:w-56">
        <Select
          value={active}
          onValueChange={(v) => {
            setActive(v);
            apply(q, v);
          }}
        >
          <SelectTrigger className="text-white bg-white/3 border-white/10">
            <SelectValue placeholder="Filter active" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Guards</SelectItem>
            <SelectItem value="ACTIVE">Active Guards</SelectItem>
            <SelectItem value="INACTIVE">Inactive Guards</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdminGuardsToolbar;

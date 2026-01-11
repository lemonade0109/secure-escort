"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

const TYPE_OPTIONS = [
  { label: "All Types", value: "ALL_TYPES" },
  { label: "Personal Security", value: "PERSONAL_SECURITY" },
  { label: "Escort", value: "ESCORT" },
  { label: "Delivery", value: "DELIVERY" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL_STATUSES" },
  { label: "Pending", value: "PENDING" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];
const RequestFilters: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [type, setType] = React.useState(searchParams.get("type") || "");
  const [status, setStatus] = React.useState(searchParams.get("status") || "");

  function apply() {
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set("type", type);
    else params.delete("type");
    if (status) params.set("status", status);
    else params.delete("status");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function clear() {
    setType("");
    setStatus("");
    router.push(pathname);
  }

  return (
    <Card className="text-white border-white/10 bg-white-4 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="grid items-end gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-white/50">
              Type
            </p>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full mt-2 text-white rounded-md outline-none border-white/10 bg-white/5">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase text-white/50">
              Status
            </p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full mt-2 text-white rounded-md outline-none border-white/10 bg-white/5">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={apply}
              className="text-black bg-gold hover:bg-gold/90"
            >
              Apply
            </Button>
            <Button
              variant="outline"
              className="text-white border-white/15 hover:text-white/90 hover:bg-white/10"
              onClick={clear}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestFilters;

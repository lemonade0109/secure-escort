import { AnyObj, RequestDetailsProps } from "@/types";
import { RequestType } from "@prisma/client";

function str(v: unknown) {
  return typeof v === "string" ? v : "";
}
function num(v: unknown) {
  return typeof v === "number" ? v : NaN;
}

export function TimeLineItem({
  title,
  desc,
  active,
}: {
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="pt-1">
        <div
          className={[
            "size-3 rounded-full border",
            active
              ? "border-gold bg-gold/40 shadow-[0_0_0_6px_rgba(212,160,23,10)]"
              : "border-white/20 bg-white/5",
          ].join(" ")}
        />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-white/60">{desc}</p>
      </div>
    </div>
  );
}

export function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | undefined | null;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs tracking-widest uppercase text-white/50">{label}</p>
      <p
        className={`mt-1 text-sm text-white ${mono ? "font-mono" : ""} break-all`}
      >
        {value && String(value).trim().length ? String(value).trim() : "-"}
      </p>
    </div>
  );
}

export function requestTypeLabel(type: string) {
  switch (type) {
    case "PERSONAL_SECURITY":
      return "Personal Security";
    case "ESCORT":
      return "Escort Service";
    case "DELIVERY":
      return "Delivery Service";
    default:
      return type;
  }
}

export function getSummary(details: RequestDetailsProps, type: string) {
  switch (type) {
    case "ESCORT":
    case "DELIVERY":
      return {
        primary: details.pickup ? ` ${details.pickup}` : "Pickup",
        secondary: details.dropoff ? ` ${details.dropoff}` : "Drop-off",
      };
    case "PERSONAL_SECURITY":
      return {
        primary: details.location ? ` ${details.location}` : "Location",
        secondary: details.durationHours
          ? ` ${details.durationHours} hour(s)`
          : "Duration",
      };
    default:
      return type;
  }
}

export function getSummaryList(type: string, details: Record<string, unknown>) {
  if (type === "PERSONAL_SECURITY")
    return details.location ? `Location: ${details.location}` : "-";
  if (type === "ESCORT")
    return details.pickup && details.dropoff
      ? `From ${details.pickup} to ${details.dropoff}`
      : "-";
  if (type === "DELIVERY")
    return details.pickup && details.dropoff
      ? `From ${details.pickup} to ${details.dropoff}`
      : "-";
  return "Service Request";
}

export function getRequestRouteFromDetails(
  type: RequestType,
  details: RequestDetailsProps
): { primary: string; secondary?: string } {
  const d = (details ?? {}) as AnyObj;

  if (type === "PERSONAL_SECURITY") {
    const location = str(d.location);
    const date = str(d.date);

    return {
      primary: location || "_",
      secondary: date ? `Date: ${date}` : undefined,
    };
  }

  const pickup = str(d.pickup);
  const dropoff = str(d.dropoff);
  return {
    primary: pickup || "_",
    secondary: dropoff ? `To: ${dropoff}` : undefined,
  };
}

export function getTrackingMeta(details: RequestDetailsProps) {
  const d = (details ?? {}) as AnyObj;

  return {
    time: str(d.time),
    persons: num(d.persons),
    itemsDescription: str(d.itemsDescription),
    estimatedValue: num(d.estimatedValue),
  };
}

export function readDetail(details: RequestDetailsProps, key: string) {
  const d = details?.[key];
  if (d === null || d === undefined) return "_";
  if (typeof d === "string" && d.trim().length === 0) return "_";
  return String(d);
}

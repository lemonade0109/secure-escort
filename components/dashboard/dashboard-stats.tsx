import { DashboardStatsProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DashboardStats = (props: DashboardStatsProps) => {
  const { total, active, completed } = props.stats;

  const items = [
    { label: "Total Requests", value: total },
    { label: "Active", value: active },
    { label: "Completed", value: completed },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((i) => (
        <Card
          key={i.label}
          className="
            relative overflow-hidden
            border border-white/10
            bg-white/5
            backdrop-blur-xl
            text-white
          "
        >
          {/* subtle top glow line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest text-white/60">
              {i.label}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mt-2 text-2xl sm:text-3xl font-semibold text-gold">
              {i.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

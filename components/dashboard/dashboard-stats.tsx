import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const stats = [
  { label: "Total Requests", value: "0" },
  { label: "Active", value: "0" },
  { label: "Completed", value: "0" },
];

const DashboardStats = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <Card
          key={s.label}
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
              {s.label}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mt-2 text-3xl font-semibold text-gold">
              {s.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

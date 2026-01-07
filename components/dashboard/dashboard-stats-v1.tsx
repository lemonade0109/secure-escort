import React from "react";
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
          className="border-white/10 bg-white/4 text-white backdrop-blur-xl"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {s.label}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-semibold">{s.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

import { getAdminStatsAction } from "@/lib/actions/admin/requests";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const AdminStats: React.FC = async () => {
  const stats = await getAdminStatsAction();

  const items = [
    { label: "Pending", value: stats.pending },
    { label: "Assigned", value: stats.assigned },
    { label: "In Progress", value: stats.inProgress },
    { label: "Completed", value: stats.completed },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="text-white border-white/10 bg-white/4 backdrop-blur-xl"
        >
          {/* subtle top glow line */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;

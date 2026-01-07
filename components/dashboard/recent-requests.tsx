import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const RecentRequests = () => {
  return (
    <Card
      className="
        relative overflow-hidden
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        text-white
      "
    >
      {/* top glow divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm uppercase tracking-widest text-white/70">
          Recent Requests
        </CardTitle>

        <Button
          asChild
          variant="outline"
          className="
            border-white/15
            bg-white/5
            text-white
            hover:text-white/90
            hover:bg-white/10
          "
        >
          <Link href="/request">New Request</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* empty state */}
        <div
          className="
            rounded-xl
            border border-white/10
            bg-white/3
            p-5
          "
        >
          <p className="text-sm text-white/80">No requests yet</p>

          <p className="mt-1 text-xs text-white/60">
            Your latest escort or delivery requests will appear here once
            created.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentRequests;

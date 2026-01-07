import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

const QuickActions = () => {
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

      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-widest text-white/70">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          asChild
          className="
            w-full
            bg-gold
            px-4 py-3
            text-sm
            font-medium
            text-black
            hover:bg-gold/90
            transition duration-300
          "
        >
          <Link href="/request">Create New Request</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="
            w-full
            border-white/15
            bg-white/5
            px-4 py-3
            text-sm
            text-white
            hover:text-white/90
            hover:bg-white/10
            transition duration-300
          "
        >
          <Link href="/tracking">Track Package</Link>
        </Button>

        <div className="pt-2 text-xs text-white/60 leading-relaxed">
          Tip: Accurate pickup and drop-off details help assign guards faster.
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

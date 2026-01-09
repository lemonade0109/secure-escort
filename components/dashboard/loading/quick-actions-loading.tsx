import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const QuickActionsLoading = () => {
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
          <span className="block">
            <Skeleton className="h-4 w-32" />
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          asChild
          className="
            w-full
            px-4 py-3
            text-sm
            font-medium
            text-black
          "
        >
          <Skeleton className="h-8 w-full" />
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
          <Skeleton className="h-8 w-full" />
        </Button>

        <span className="pt-2 text-xs text-white/60 leading-relaxed block">
          <Skeleton className="h-4 w-full" />
        </span>
      </CardContent>
    </Card>
  );
};

export default QuickActionsLoading;

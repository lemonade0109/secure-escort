import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

const QuickActions = () => {
  return (
    <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 space-x-3">
        <Button
          asChild
          className="bg-gold px-4 py-3 hover:bg-gold/90 text-black"
        >
          <Link href="/request">Create New Request</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="border-white/15 px-4 py-3 bg-white/3 text-white hover:text-white/90 hover:bg-white/6"
        >
          <Link href="/tracking">Track Package</Link>
        </Button>

        <div className="pt-3 text-xs text-white/60">
          Tip: Accurate pickup/drop-off details improves guard assignment speed.
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

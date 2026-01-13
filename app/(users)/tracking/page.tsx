"use client";
import React, { Suspense } from "react";
import TrackingForm from "./tracking-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlowBackground from "@/components/shared/glow-background";

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-white relative overflow-hidden">
      <GlowBackground intensity="medium" />

      <div className="max-w-3xl px-6 py-12 mx-auto">
        <Card className="relative z-10 text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">Track Delivery</CardTitle>
            <p className="text-sm text-white/70">
              Enter your tracking code to see status updates and ETA.
            </p>
          </CardHeader>

          <CardContent>
            <Suspense>
              <TrackingForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

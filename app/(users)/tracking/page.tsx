"use client";
import React, { Suspense } from "react";
import TrackingForm from "./tracking-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlowBackground from "@/components/shared/glow-background";
import Link from "next/link";

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-[#070a12] text-white relative overflow-hidden">
      <GlowBackground intensity="medium" />

      <div className="max-w-3xl px-6 py-8 sm:py-12 mx-auto">
        <Card className="relative z-10 text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader>
            <div className="">
              <Link
                href="/dashboard"
                className="text-[10px] tracking-widest uppercase text-white/50"
              >
                Dashboard
              </Link>
              <CardTitle className="text-lg sm:text-xl md:text-2xl">
                Track Delivery
              </CardTitle>
            </div>
            <p className="text-sm sm:text-base text-white/70">
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

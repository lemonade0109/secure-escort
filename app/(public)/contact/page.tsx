import GlowBackground from "@/components/shared/glow-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Contact - Secure Escort",
  description:
    "Get in touch with Secure Escort for support, partnership, or service inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-14">
        <div className="text-center">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase text-white/50"
          >
            Secure Escort
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">
            Contact Us
          </h1>
        </div>

        {/* Contact cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Card className="border-white/10 bg-white/4 backdrop-blur-xl text-white">
            <CardHeader>
              <CardTitle className="text-lg">Customer Support</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-white/80">
              <p>For active requests, tracking help, or general questions.</p>
              <p>
                Email:{" "}
                <span className="text-white font-medium">
                  +234 800 000 0000
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/4 backdrop-blur-xl text-white">
            <CardHeader>
              <CardTitle className="text-lg">Partnerships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/80">
              <p>
                Interested in partnering with us? We&apos;d love to hear from
                you.
              </p>
              <p>
                Email:{" "}
                <span className="text-white font-medium">
                  partners@secureescort.com{" "}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-white/10 bg-white/4 backdrop-blur-xl text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold">
              Need immediate assistance?
            </h2>

            <p className="mt-3 text-sm text-white/70">
              Create a request and we&apos;ll assign a guard as soon as possible
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link href="/request"> Create a Requests</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 hover:text-white/90"
              >
                <Link href="/tracking">Track a Request</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

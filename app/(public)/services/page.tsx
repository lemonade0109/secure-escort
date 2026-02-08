import GlowBackground from "@/components/shared/glow-background";
import FadeUp from "@/components/motion/FadeUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Services - Secure Escort",
  description:
    "Explore Secure Escort services: Personal Security, Secure Escort, and Valuable Delivery with tracking and trusted professionals.",
};

const SERVICES = [
  {
    icon: "🛡️",
    badge: "Personal",
    title: "Personal Security",
    desc: "Trained guards for personal safety, VIP movement, events, and private protection with professional presence.",
    highlights: [
      "VIP & event coverage",
      "Hourly duration-based requests",
      "Guard assignment + timeline updates",
    ],
    ctaHref: "/request?type=PERSONAL_SECURITY",
    ctaLabel: "Request Personal Security",
  },
  {
    icon: "🚘",
    badge: "Escort",
    title: "Secure Escort",
    desc: "Professional escort services for safe transit of individuals and valuables with clear pickup/dropoff details.",
    highlights: [
      "Pickup → dropoff routing",
      "Status progression updates",
      "Guard availability scheduling",
    ],
    ctaHref: "/request?type=ESCORT",
    ctaLabel: "Request Escort",
  },
  {
    icon: "📦",
    badge: "Courier",
    title: "Valuable Delivery",
    desc: "Secure courier delivery for important items with tracking pings, checkpoints, and transparent status updates.",
    highlights: [
      "Tracking code + live map",
      "Checkpoint confirmations",
      "ETA window visibility",
    ],
    ctaHref: "/request?type=DELIVERY",
    ctaLabel: "Request Delivery",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-12 sm:pt-14 pb-8">
        <div className="text-center">
          <FadeUp>
            <Link
              href="/"
              className="text-xs tracking-widest uppercase text-white/50"
            >
              Secure Escort
            </Link>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Services built for trust, safety, and clarity.
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              Choose the service that matches your need, submit a request in
              seconds, then track progress from assignment to completion.
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                className="bg-gold text-black hover:bg-gold/90 px-7 py-6 text-base w-full sm:w-auto"
              >
                <Link href="/request">Create a Request</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-white/15 bg-white/3 text-white hover:text-white/90 hover:bg-white/6 px-7 py-6 text-base w-full sm:w-auto"
              >
                <Link href="/tracking">Track a Request</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Cards */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map((s, index) => (
            <FadeUp key={s.title} delay={0.12 + index * 0.06}>
              <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl overflow-hidden">
                {/* top shimmer */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-20 left-8 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)] blur-2xl" />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm">
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-xs uppercase tracking-widest text-white/60">
                          {s.badge}
                        </span>
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1 text-[11px] text-white/70">
                        Available
                      </span>
                    </div>

                    <CardTitle className="mt-3 text-xl">{s.title}</CardTitle>
                    <p className="mt-2 text-sm text-white/70">{s.desc}</p>
                  </CardHeader>
                </div>

                <CardContent className="space-y-4">
                  <div className="h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />

                  <ul className="space-y-2 text-sm text-white/80">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-0.5 text-gold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 flex flex-col gap-3">
                    <Button
                      asChild
                      className="bg-gold text-black hover:bg-gold/90 w-full"
                    >
                      <Link href={s.ctaHref}>{s.ctaLabel}</Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="border-white/15 bg-white/3 text-white hover:text-white/90 hover:bg-white/6 w-full"
                    >
                      <Link href="/tracking">Track Delivery</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Real-time visibility",
              desc: "Tracking pings and checkpoints create confidence for users and accountability for guards.",
            },
            {
              title: "Operations-grade flow",
              desc: "Admin assigns guards, sets ETA windows, and updates status while all actions log into timelines.",
            },
            {
              title: "Built for safety",
              desc: "Role protection, verification, and audit trails help keep the platform secure and professional.",
            },
          ].map((t, index) => (
            <FadeUp key={t.title} delay={0.12 + index * 0.06}>
              <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="mt-2 text-sm text-white/70">{t.desc}</p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-14 sm:pb-16">
        <FadeUp delay={0.12}>
          <Card className="border-white/10 bg-white/4 text-white backdrop-blur-xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-130 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.22),transparent)] blur-2xl" />
            </div>

            <CardContent className="relative z-10 p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                Ready to secure what matters?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
                Create a request in seconds, get a guard assigned, follow
                updates, and complete safely.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  asChild
                  className="bg-gold text-black hover:bg-gold/90 px-8 py-6 text-base w-full sm:w-auto"
                >
                  <Link href="/request">Create a Request</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-white/15 bg-white/3 text-white hover:text-white/90 hover:bg-white/6 px-8 py-6 text-base w-full sm:w-auto"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </section>
    </main>
  );
}

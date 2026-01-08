import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlowBackground from "@/components/shared/glow-background";
import { Button } from "@/components/ui/button";

const services = [
  {
    type: "PERSONAL_SECURITY",
    icon: "🛡️",
    title: "Personal Security",
    desc: "Hire a trained guard for events, venues, VIP protection or personal safety.",
  },
  {
    type: "ESCORT",
    icon: "🚶",
    title: "Escort Service",
    desc: "Get escorted safely from pickup to destination with tracking + ETA updates.",
  },
  {
    type: "DELIVERY",
    icon: "📦",
    title: "Valuables Delivery",
    desc: "Secure courier delivery with a tracking code and real-time status updates.",
  },
] as const;

export default function RequestPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Create a Request
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Choose a service below. You’ll be taken to a quick form.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.type}
              className="border-white/10 bg-white/4 text-white backdrop-blur-xl overflow-hidden"
            >
              <CardHeader className="space-y-2">
                <div className="text-3xl">{service.icon}</div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <p className="text-sm text-white/70">{service.desc}</p>

                <div className="h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />

                <Button
                  asChild
                  className="w-full bg-gold text-black hover:bg-gold/90"
                >
                  <Link href={`/request/new?type=${service.type}`}>Select</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

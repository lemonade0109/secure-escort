import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlowBackground from "@/components/shared/glow-background";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/shared/card/service-card";

const services = [
  {
    type: "PERSONAL_SECURITY",
    text: "PERSONAL SECURITY",
    icon: "🛡️",
    title: "Personal Security",
    desc: "Hire a trained guard for events, venues, VIP protection or personal safety.",
  },
  {
    type: "ESCORT",
    text: "ESCORT",
    icon: "🚚",
    title: "Escort Service",
    desc: "Get escorted safely from pickup to destination with tracking + ETA updates.",
  },
  {
    type: "DELIVERY",
    text: "COURIER",
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
        <div className="my-10">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Create a Request
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Choose a service below. You’ll be taken to a quick form.
          </p>
        </div>

        <div className=" w-full">
          <ul className="w-full grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <li key={service.type} className="">
                <ServiceCard
                  spanText={service.text}
                  serviceCard={false}
                  icon={service.icon}
                  title={service.title}
                  description={service.desc}
                  linkHref={`/request/new?type=${service.type}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

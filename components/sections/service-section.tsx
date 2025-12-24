import React from "react";
import ServiceCard from "../shared/card/service-card";
import FadeUp from "@/components/motion/FadeUp";
import GlowBackground from "../shared/glow-background";

const ServiceSection = () => {
  return (
    <section className="relative w-full bg-[#070a12] text-white py-20 overflow-hidden">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Our Core Services
            </h2>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="mt-3 text-white/70">
              Professional protection and secure delivery services tailored to
              your needs.
            </p>
          </FadeUp>
        </div>

        {/* Service cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <FadeUp delay={0.06}>
            <ServiceCard
              icon="🛡️"
              spanText="Personal"
              title="Personal Security"
              description="Request trained guards for personal safety, events, and VIP movement"
              linkHref="/services"
            />
          </FadeUp>

          <FadeUp delay={0.12}>
            <ServiceCard
              icon="🚚"
              spanText="Escort"
              title="Secure Escort"
              description="Professional escort services for safe transit of individuals and valuables."
              linkHref="/services"
            />
          </FadeUp>

          <FadeUp delay={0.18}>
            <ServiceCard
              icon="📦"
              spanText="Courier"
              title="Valuable Delivery"
              description="Secure courier delivery with tracking code + live status updates."
              linkHref="/services"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;

import React from "react";
import ServiceCard from "../shared/service-card";

const ServiceSection = () => {
  return (
    <section className="relative w-full bg-[#070a12] text-white py-20">
      {/* Subtle glow background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(40% 25% at 50% 0%, rgba(212,160,23,0.08), transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold ">
            Our Core Services
          </h2>

          <p className="mt-3 text-white/70">
            Professional protection and secure delivery services tailored to
            your needs.{" "}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Service cards */}
          <ServiceCard
            icon="🛡️"
            spanText="Personal"
            title="Personal Security"
            description="Request trained guards for personal safety, events, and VIP movement"
            linkHref="/services"
          />

          <ServiceCard
            icon="🚚"
            spanText="Escort"
            title="Secure Escort"
            description="Professional escort services for safe transit of individuals and valuables."
            linkHref="/services"
          />

          <ServiceCard
            icon="📦"
            spanText="Courier"
            title="Valuable Delivery"
            description="Secure courier delivery with tracking code + live status updates."
            linkHref="/services"
          />
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;

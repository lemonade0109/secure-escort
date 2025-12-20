import Navbar from "@/components/layout/navbar/navbar";
import CTASection from "@/components/sections/CTA-section";
import HeroSection from "@/components/sections/hero-section";
import HowItWorksSection from "@/components/sections/howitworks-section";
import ServiceSection from "@/components/sections/service-section";
import TrustSection from "@/components/sections/trust-section";
import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070A12] bg-[radial-gradient(70%_50%_at50%_0%, rgba(212,160,23,0.12)), transparent_60%] text-white">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <ServiceSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}

import React from "react";
import CinematicCard from "../shared/card/cinematic-card";
import FadeUp from "@/components/motion/FadeUp";

const TrustSection = () => {
  return (
    <section className="w-full bg-[#070a12] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-semibold text-center">
            Trusted Security & Delivery You Can Rely On
          </h2>
        </FadeUp>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FadeUp delay={0.06}>
            <CinematicCard>
              <div className="mb-4 text-gold text-3xl">👮‍♂️</div>
              <h3 className="text-xl font-medium mb-2">
                Verified & Trained Guards
              </h3>
              <p className="text-sm text-white/70">
                All guards are professionally trained and vetted for safety and
                reliability.
              </p>
            </CinematicCard>
          </FadeUp>

          <FadeUp delay={0.12}>
            <CinematicCard>
              <div className="mb-4 text-gold text-3xl">📍</div>
              <h3 className="text-xl font-medium mb-2">Real Time Tracking</h3>
              <p className="text-sm text-white/70">
                Track your escort or delivery live from pickup to destination.
              </p>
            </CinematicCard>
          </FadeUp>

          <FadeUp delay={0.18}>
            <CinematicCard>
              <div className="mb-4 text-gold text-3xl">🕒</div>
              <h3 className="text-xl font-medium mb-2">24/7 Availability</h3>
              <p className="text-sm text-white/70">
                Request services anytime, day or night - when you need
                protection.
              </p>
            </CinematicCard>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

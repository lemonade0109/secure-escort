import React from "react";
import CinematicCardV2 from "../shared/cinematic-card-v2";
import CinematicCard from "../shared/cinematic-card";

const TrustSection = () => {
  return (
    <section className="w-full bg-[#070a12] text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center">
          Trusted Security & Delivery You Can Rely On
        </h2>

        {/* Card will go here */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
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

          {/* Card 2 */}
          <CinematicCard>
            <div className="mb-4 text-gold text-3xl">📍</div>
            <h3 className="text-xl font-medium mb-2">Real Time Tracking</h3>
            <p className="text-sm text-white/70">
              Track your escort or delivery live from pickup to destination.
            </p>
          </CinematicCard>

          {/* Card 3 */}
          <CinematicCard>
            <div className="mb-4 text-gold text-3xl">🕒</div>
            <h3 className="text-xl font-medium mb-2">24/7 Availability</h3>
            <p className="text-sm text-white/70">
              Request services anytime, day or night - when you need protection.
            </p>
          </CinematicCard>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

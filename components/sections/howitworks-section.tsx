import React from "react";
import FadeUp from "@/components/motion/FadeUp";

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Make a Request",
      description:
        "Choose escort or delivery, enter details, and submit in seconds.",
      num: "01",
    },
    {
      title: "Guard Assigned",
      description:
        "A trained guard is assigned and you receive a tracking code.",
      num: "02",
    },
    {
      title: "Track to Completion",
      description:
        "Follow status updates and ETA until the job is completed safely.",
      num: "03",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-[#070A12] text-white">
      {/* Subtle glow background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, rgba(212,160,23,0.18), transparent 65%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-semibold">How It Works</h2>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="mt-3 text-white/70">
              Simple steps from request to completion — built for trust.
            </p>
          </FadeUp>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.06}>
              <div className="relative rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/50">
                    Step
                  </span>
                  <span className="text-sm font-semibold text-gold">
                    {step.num}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>

                <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

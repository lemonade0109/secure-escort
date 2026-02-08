import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import FadeUp from "../motion/FadeUp";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#070A12] py-16 sm:py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
        {/* Text grid */}

        <div className="mx-auto w-full max-w-2xl px-6 sm:px-8 lg:px-12 text-center lg:text-left">
          <FadeUp delay={0.0}>
            <span className="inline-block mb-3 text-sm tracking-wide text-gold">
              Trusted Security Services
            </span>
          </FadeUp>

          <FadeUp delay={0.06}>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-serif">
              Secure Escorts & Courier Services
            </h1>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-xl text-white/70 text-sm sm:text-base">
              Request professional guard or secure courier services. Track
              movements in real-time and get an estimated time of arrival.
              Experience safety and reliability with Secure Escort.
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <Button
                asChild
                variant="default"
                className="bg-gold hover:bg-gold/90 text-black px-5 py-3 w-full sm:w-auto"
              >
                <Link href="/request" className="  text-sm">
                  Request a Guard
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="text-white hover:text-white/80 hover:bg-accent-foreground/20 w-full sm:w-auto"
              >
                <Link href="/tracking" className="">
                  Track Delivery
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* Image grid */}
        <FadeUp delay={0.1} className="w-full px-6 sm:px-8 lg:px-0">
          <div className="relative h-80 sm:h-96 lg:h-130 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/heroimg.png"
              alt="Security escort and protected delivery"
              className="object-cover"
              priority
              fill
            />
            {/* Black overlay for contrast */}
            <div className="absolute inset-0 bg-black/35" />
            {/* Gradient overlay to blend with text section */}
            <div className="absolute inset-y-0 left-0 w-1/2 lg:w-1/3 bg-linear-to-l from-transparent to-[#070a12]" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default HeroSection;

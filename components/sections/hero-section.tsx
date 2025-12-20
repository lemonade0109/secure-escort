import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#070A12] py-20 lg:py-28 ">
      <div className="grid grid-cols-1 lg:grid-cols-2  items-center">
        {/* Text grid */}
        <div className="container mx-auto px-12 text-center lg:text-left">
          <span className="inline-block mb-3 text-sm tracking-wide text-gold">
            Trusted Security Services
          </span>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl font-serif">
            Secure Escorts & Courier Services
          </h1>

          <p className="mt-6 max-w-xl text-white/70 text-sm">
            Request professional guard or secure courier services. Track
            movements in real-time and get an estimated time of arrival.
            Experience safety and reliability with Secure Escort.
          </p>

          <div className="mt-8 flex items-center justify-center lg:justify-start gap-8 flex-wrap">
            <Button
              asChild
              variant="default"
              className=" bg-gold hover:bg-gold/90 text-black px-4 py-3 "
            >
              <Link href="/request" className="  text-sm">
                Request a Guard
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="text-white hover:text-white/80 hover:bg-accent-foreground/20"
            >
              <Link href="/tracking" className="">
                Track Delivery
              </Link>
            </Button>
          </div>
        </div>

        {/* Image grid */}
        <div className="container relative h-105 sm:h-120 lg:h-130 rounded-2xl overflow-hidden shadow-lg mx-auto lg:mx-0">
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
      </div>
    </section>
  );
};

export default HeroSection;

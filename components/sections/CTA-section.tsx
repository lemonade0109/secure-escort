import Link from "next/link";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-[#070A12] text-white">
      {/* Strong CTA glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, rgba(212,160,23,0.24), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          Ready to Secure What Matters?
        </h2>

        <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
          Request a professional guard or track your secured delivery in
          real-time — built for trust, safety, and peace of mind.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            className="bg-gold text-black hover:bg-gold/90 hover:transition-colors duration-300 px-8 py-6 text-base font-medium"
          >
            <Link href="/request">Request a Guard</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="text-white hover:text-white/80 hover:bg-accent-foreground/20 hover:transition-colors duration-300 px-8 py-6 text-base"
          >
            <Link href="/tracking" className="">
              Track Delivery
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

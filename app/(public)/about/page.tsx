import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About - Secure Escort",
  description:
    "Learn about Secure Escort, our mission, and how we deliver safe, trackable escort and security services.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase text-white/50"
          >
            Secure Escort
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">About Us</h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            Secure Escort is a modern protection platform designed to connect
            clients with professional guards, track services in real time, and
            ensure every request is handled with clarity and accountability.
          </p>
        </div>

        {/* Mission */}
        <Card className="mt-10 border-white/10 bg-white/4 backdrop-blur-xl">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white">Our Mission</h2>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              To make personal security, escort, and valuable delivery services
              transparent, trackable, and reliable. We believe safety should
              come with visibility, trust, and professional accountability.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Trust",
              desc: "Every request is logged, tracked, and recorded through a full timeline of events.",
            },
            {
              title: "Transparency",
              desc: "Users see real-time guard movement, status changes, and ETA windows.",
            },
            {
              title: "Professionalism",
              desc: "Guards are managed through structured assignments and availability systems.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border-white/10 bg-white/4 backdrop-blur-xl"
            >
              <CardContent className="p-6">
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-white/70">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-10 border-white/10 bg-white/4 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Ready to experience secure movement?
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Submit a request and follow every step from assignment to
              completion.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link href="/request">Create a Request</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-white/15 bg-white/3 text-white hover:bg-white/6 hover:text-white/90"
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

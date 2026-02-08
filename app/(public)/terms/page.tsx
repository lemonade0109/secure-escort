import GlowBackground from "@/components/shared/glow-background";
import FadeUp from "@/components/motion/FadeUp";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - Secure Escort",
  description:
    "Review the terms that govern the use of Secure Escort, including service rules, responsibilities, and safety policies.",
};

const TERMS_SECTIONS = [
  {
    title: "Using the platform",
    body: [
      "You must provide accurate account and request information.",
      "You are responsible for activity under your account.",
      "You must comply with local laws and safety instructions.",
    ],
  },
  {
    title: "Requests and service fulfillment",
    body: [
      "Requests are subject to guard availability and verification checks.",
      "We may update status or ETA based on operational changes.",
      "You agree to follow guard instructions during service.",
    ],
  },
  {
    title: "Payments and cancellations",
    body: [
      "Fees are displayed before confirmation where applicable.",
      "Cancellations may incur charges depending on timing.",
      "Refunds are handled according to our support review process.",
    ],
  },
  {
    title: "Safety and compliance",
    body: [
      "Harassment, abuse, or misuse of the service is prohibited.",
      "We may suspend accounts to protect users and staff.",
      "We cooperate with lawful requests where required.",
    ],
  },
  {
    title: "Liability",
    body: [
      'We provide services on an "as available" basis and do not guarantee uninterrupted access.',
      "We are not responsible for delays caused by external factors.",
      "Our total liability is limited to fees paid for the service.",
    ],
  },
  {
    title: "Updates to these terms",
    body: [
      "We may update terms to reflect service changes or legal requirements.",
      "Material updates will be communicated through the platform.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-14">
        <div className="text-center">
          <FadeUp>
            <Link
              href="/"
              className="text-xs tracking-widest uppercase text-white/50"
            >
              Secure Escort
            </Link>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold">
              Terms of Service
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              These terms govern your use of Secure Escort, including requests,
              tracking, and communications. Please read them carefully.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.18}>
          <Card className="mt-10 border-white/10 bg-white/4 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <p className="text-sm text-white/70">
                By creating an account or submitting a request, you agree to
                comply with these terms. If you do not agree, please do not use
                the platform.
              </p>
              <p className="text-sm text-white/70">
                Questions about these terms? Visit our{" "}
                <Link href="/contact" className="text-gold hover:text-gold/90">
                  contact page
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </FadeUp>

        <div className="mt-6 grid gap-6">
          {TERMS_SECTIONS.map((section, index) => (
            <FadeUp key={section.title} delay={0.24 + index * 0.04}>
              <Card className="border-white/10 bg-white/4 backdrop-blur-xl">
                <CardContent className="p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-white">
                    {section.title}
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-white/70">
                    {section.body.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 text-gold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.36}>
          <Card className="mt-10 border-white/10 bg-white/4 backdrop-blur-xl">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Need help?
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Reach our support team at{" "}
                <span className="text-white font-medium">
                  support@secureescort.com
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </main>
  );
}

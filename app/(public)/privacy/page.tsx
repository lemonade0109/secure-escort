import GlowBackground from "@/components/shared/glow-background";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Secure Escort",
  description:
    "Learn how Secure Escort collects, uses, and protects your data across requests, tracking, and platform services.",
};

const POLICY_SECTIONS = [
  {
    title: "Information we collect",
    body: [
      "Account details such as name, email, phone number, and role selection.",
      "Request details including pickup/dropoff, schedule, and service type.",
      "Tracking events, status updates, and guard assignment activity.",
      "Device and usage data to keep the platform secure and reliable.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "Process requests, assign guards, and deliver real-time updates.",
      "Improve safety workflows, monitoring, and customer support.",
      "Send important account or service notifications.",
      "Comply with legal or regulatory requirements where applicable.",
    ],
  },
  {
    title: "Sharing and disclosure",
    body: [
      "We share data only with assigned guards and authorized staff for service fulfillment.",
      "Vendors or processors may access limited data to help run the platform.",
      "We may disclose information if required by law or to protect user safety.",
    ],
  },
  {
    title: "Data security",
    body: [
      "We use access controls, audit logs, and secure infrastructure to protect data.",
      "Only authorized personnel can access sensitive information.",
      "No system is 100% secure, but we continuously improve protections.",
    ],
  },
  {
    title: "Retention",
    body: [
      "We retain data as long as needed to provide services and comply with obligations.",
      "You may request deletion when legally permissible.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "Update your profile details anytime in your account.",
      "Request a copy of your data or ask for corrections.",
      "Contact support for deletion or privacy-related questions.",
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "We use essential cookies for authentication and session security.",
      "Analytics help us understand usage patterns and improve performance.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-14">
        <div className="text-center">
          <Link
            href="/"
            className="text-xs tracking-widest uppercase text-white/50"
          >
            Secure Escort
          </Link>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
            Your privacy matters. This policy explains how Secure Escort
            collects, uses, and protects your information across requests,
            tracking, and support interactions.
          </p>
        </div>

        <Card className="mt-10 border-white/10 bg-white/4 backdrop-blur-xl">
          <CardContent className="p-8 space-y-4">
            <p className="text-sm text-white/70">
              By using Secure Escort, you agree to the practices described here.
              We update this policy periodically to reflect new services or
              legal requirements.
            </p>
            <p className="text-sm text-white/70">
              For questions, reach out at{" "}
              <span className="text-white font-medium">
                support@secureescort.com
              </span>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-gold hover:text-gold/90">
                contact page
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6">
          {POLICY_SECTIONS.map((section) => (
            <Card
              key={section.title}
              className="border-white/10 bg-white/4 backdrop-blur-xl"
            >
              <CardContent className="p-6">
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
          ))}
        </div>

        <Card className="mt-10 border-white/10 bg-white/4 backdrop-blur-xl">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white">
              Contact our privacy team
            </h2>
            <p className="mt-3 text-sm text-white/70">
              If you need more information about how your data is handled or
              want to exercise your privacy rights, email us at{" "}
              <span className="text-white font-medium">
                privacy@secureescort.com
              </span>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

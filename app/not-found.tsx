import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a12] text-white flex items-center justify-center">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-130 w-225 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.20),transparent)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0,rgba(212,160,23,0.12),transparent_65%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl border-white/10 bg-white/5 backdrop-blur-xl">
          {/* top gold divider */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-gold/60 to-transparent" />

          <CardHeader className="text-center">
            <p className="text-xs uppercase tracking-widest text-white/60">
              Error 404
            </p>

            <CardTitle className="mt-2 text-2xl sm:text-3xl font-semibold">
              Page not found
            </CardTitle>

            <p className="mt-2 text-sm text-white/70">
              The page you’re trying to access doesn’t exist or was moved. Use
              the options below to get back on track.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <Link href="/">Go to Home</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white/90"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-white/70">
                Tip: If you typed the URL manually, check for spelling errors.
              </p>
              <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent" />
              <p className="mt-3 text-[11px] text-white/50">
                Secure Escort • Safety & Tracking
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

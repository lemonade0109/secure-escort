import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a12] text-white flex items-center justify-center">
      {/* subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-130 w-225 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.20),transparent)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0,rgba(212,160,23,0.12),transparent_65%)]" />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full min-h-screen px-4 mx-auto sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl border-white/10 bg-white/5 backdrop-blur-xl">
          {/* top gold divider */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-gold/60 to-transparent" />

          <CardHeader className="text-center">
            <p className="text-xs tracking-widest uppercase text-white/60">
              Error 404
            </p>

            <CardTitle className="mt-2 text-2xl font-semibold text-blue-100 sm:text-3xl">
              Page not found
            </CardTitle>

            <p className="mt-2 text-sm text-white/70">
              The page you’re trying to access doesn’t exist or was moved. Use
              the options below to get back on track.
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button asChild className="text-black bg-gold hover:bg-gold/90">
                <Link href="/">Go to Home</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="text-white border-white/15 bg-white/5 hover:bg-white/10 hover:text-white/90"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>

            <div className="p-4 mt-6 border rounded-xl border-white/10 bg-white/3">
              <p className="text-xs text-white/70">
                Tip: If you typed the URL manually, check for spelling errors.
              </p>
              <div className="w-full h-px mt-4 bg-linear-to-r from-transparent via-white/15 to-transparent" />
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

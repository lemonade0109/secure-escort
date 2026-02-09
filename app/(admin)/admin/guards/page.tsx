import AdminGuardsTable from "@/components/admin/admin-guards-table";
import AdminGuardsToolbar from "@/components/admin/admin-guards-toolbar";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAdminGuardsAction } from "@/lib/actions/admin/get-admin-guards";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams?: Promise<{
    q?: string;
    active?: string;
    page?: string;
    limit?: string;
  }>;
};

function parseActiveFilter(active: string | undefined) {
  if (active === "ACTIVE" || active === "INACTIVE" || active === "ALL") {
    return active;
  }
  return "ALL";
}

export default async function AdminGuardsPage({ searchParams }: Props) {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) {
    redirect("/dashboard");
  }

  const sp = (await searchParams) ?? {};
  const q = sp.q || "";
  const active = parseActiveFilter(sp.active);
  const page = sp.page ? Number(sp.page) : 1;
  const limit = sp.limit ? Number(sp.limit) : 10;

  const { guards, totalPages } = await getAdminGuardsAction({
    q,
    active,
    page,
    limit,
  });

  const transformedGuards = guards.map((guard) => ({
    ...guard,
    badgeId: guard.badgeId ?? undefined,
    phone: guard.phone ?? undefined,
  }));

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-8 sm:py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/50">
              Admin ● Guards
            </p>
            <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold">
              Guard Management
            </h1>
            <p className="mt-1 text-sm hidden sm:flex text-white/70">
              Create, activate/deactivate, and assign guards to requests.
            </p>
          </div>

          <div className="flex items-center gap-2 mb-2 sm:mb-6">
            <NavigationBar />
          </div>
        </div>

        <Separator className="my-6 border-white/10" />

        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm sm:text-base">Guards</CardTitle>

            <Button
              asChild
              className="px-2 text-xs text-white border-white/15 bg-white/3 hover:bg-white/6 hover:text-white/90 w-full sm:w-auto"
              variant="outline"
            >
              <Link href={"/admin/guards/make-guard"}>Create Guard</Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <AdminGuardsToolbar defaultQ={q} defaultActive={active} />
            <AdminGuardsTable
              guards={transformedGuards}
              page={page}
              totalPages={totalPages}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

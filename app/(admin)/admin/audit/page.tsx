import AdminAuditTable from "@/components/admin/admin-audit-table";
import AdminAuditToolbar from "@/components/admin/admin-audit-toolbar";
import { AuditPagination } from "@/components/shared/audit-pagination";
import GlowBackground from "@/components/shared/glow-background";
import NavigationBar from "@/components/shared/navigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminAuditEventAction } from "@/lib/actions/admin/audit/get-admin-audit-event";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { redirect } from "next/navigation";

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email || "");
  if (!userIsAdmin) {
    redirect("/dashboard");
  }

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const type = typeof sp.type === "string" ? sp.type : "";
  const actorRole = typeof sp.actorRole === "string" ? sp.actorRole : "";
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;

  const data = await getAdminAuditEventAction({
    q,
    type,
    actorRole,
    page,
    pageSize: 12,
  });

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-white/50">
              Admin ● Audit Log
            </p>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Activity & Security
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Track all admin + guard actions for accountability and dispute
              resolution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <NavigationBar />
          </div>
        </div>

        <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle>Event Log</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <AdminAuditToolbar />

            {data.ok ? (
              <>
                <AdminAuditTable rows={data.rows} />

                <AuditPagination
                  totalPages={data.totalPages}
                  currentPage={data.page}
                  pageSize={data.pageSize}
                  baseUrl="/admin/audit"
                  query={{ q, type, actorRole }}
                />
              </>
            ) : (
              <div className="p-4 text-sm border rounded-xl border-white/10 bg-white/3 text-white/70">
                {data.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

import { getAdminRequests } from "@/lib/actions/admin/admin-requests";
import React from "react";
import { Metadata } from "next";
import GlowBackground from "@/components/shared/glow-background";
import { Bell } from "lucide-react";
import UserMenu from "@/components/dashboard/user-menu";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { redirect } from "next/navigation";
import AdminRequestsToolbar from "@/components/admin/admin-requests-toolbar";
import Link from "next/link";
import AdminAllRequestsTable from "@/components/admin/admin-all-reqeusts-table";
import { RequestDetailsProps } from "@/types";

type SearchParams = {
  page?: number;
  status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  type?: "PERSONAL_SECURITY" | "ESCORT" | "DELIVERY";
  q?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status;
  const type = params.type;
  const query = params.q;

  // Build title based on filters
  let title = "All Requests";
  const filters: string[] = [];

  if (status) {
    filters.push(status.toLowerCase().replace(/_/g, " "));
  }
  if (type) {
    filters.push(type.toLowerCase().replace(/_/g, " "));
  }
  if (query) {
    filters.push(`"${query}"`);
  }

  if (filters.length > 0) {
    title = `${filters.join(", ")} - Requests`;
  }

  if (page > 1) {
    title = `${title} - Page ${page}`;
  }

  const description =
    filters.length > 0
      ? `Viewing ${filters.join(", ")} requests on Secure Escort admin dashboard.`
      : "Filter, search, and manage all security escort requests.";

  return {
    title: `${title} | Admin Dashboard | Secure Escort`,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminRequestPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { session } = await requireVerifiedUser();
  const userIsAdmin = isAdmin(session?.user?.email);
  if (!userIsAdmin) {
    redirect("/dashboard");
  }

  const status =
    typeof (await searchParams).status === "string"
      ? (await searchParams).status
      : "ALL";
  const type =
    typeof (await searchParams).type === "string"
      ? (await searchParams).type
      : "ALL";
  const q =
    typeof (await searchParams).q === "string" ? (await searchParams).q : "";
  const page = Number((await searchParams).page) || 1;

  const data = await getAdminRequests({ status, type, q, page, limit: 10 });

  const transformedRequests = data.requests.map((request) => ({
    ...request,
    details: request.details as RequestDetailsProps,
  }));

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#070a12] text-white">
      <GlowBackground intensity="medium" />

      <div className="relative z-10 px-6 py-10 mx-auto space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-xs tracking-widest uppercase text-white/50"
            >
              Admin Dashboard
            </Link>
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">
              All Requests
            </h1>
            <p className="mt-2 text-sm text-white/70">
              Filter, search, and manage all security escort requests.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex items-center justify-center border rounded-lg size-9 border-white/10 bg-white/3 text-white/80 hover:bg-white/6"
            >
              <Bell className="size-4" />
            </button>
            <UserMenu name={session?.user?.name} email={session?.user?.email} />
          </div>
        </div>

        <AdminRequestsToolbar />
        <AdminAllRequestsTable
          rows={transformedRequests}
          page={page}
          totalPages={data.totalPages}
        />
      </div>
    </main>
  );
}

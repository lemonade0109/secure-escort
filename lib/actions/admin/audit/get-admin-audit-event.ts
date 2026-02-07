"use server";

import { db } from "@/db/db";
import { isAdmin } from "@/lib/admin";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";

export type AuditFilters = {
  q?: string;
  type?: string;
  actorRole?: string;
  page?: number;
  pageSize?: number;
};

export type AdminAuditRow = {
  id: string;
  createdAt: string;
  type: string;
  message: string;
  requestId: string;
  trackingCode: string | null;
  actorId: string | null;
  actorEmail: string | null;
  actorName: string | null;
  actorRole: string | null;
};

export type AdminAuditResponse =
  | {
      ok: true;
      rows: AdminAuditRow[];
      total: number;
      totalPages: number;
      page: number;
      pageSize: number;
    }
  | { ok: false; message: string };

const isObjectId = (value: string) => /^[a-fA-F0-9]{24}$/.test(value);

export const getAdminAuditEventAction = async (
  filters: AuditFilters,
): Promise<AdminAuditResponse> => {
  try {
    const { session } = await requireVerifiedUser();
    if (!isAdmin(session?.user?.email || "")) {
      return { ok: false, message: "Unauthorized" };
    }

    const page = Math.max(1, Number(filters.page) || 1);
    const pageSize = Math.min(50, Math.max(5, Number(filters.pageSize) || 12));
    const skip = (page - 1) * pageSize;

    const q = (filters.q ?? "").trim();
    const type = (filters.type ?? "").trim();
    const actorRole = (filters.actorRole ?? "").trim();

    const where: Record<string, unknown> = {};

    if (type) where.type = type;
    if (actorRole) where.actorRole = actorRole;
    if (q) {
      where.OR = [
        ...(isObjectId(q) ? [{ requestId: q }] : []),
        { message: { contains: q, mode: "insensitive" } },
        { request: { trackingCode: { contains: q, mode: "insensitive" } } },
        { actor: { email: { contains: q, mode: "insensitive" } } },
        { actor: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    const [total, events] = await Promise.all([
      db.requestEvent.count({ where }),
      db.requestEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          createdAt: true,
          type: true,
          message: true,
          requestId: true,
          actorId: true,
          actorRole: true,
          request: {
            select: {
              trackingCode: true,
            },
          },
          actor: { select: { name: true, email: true } },
        },
      }),
    ]);

    const rows: AdminAuditRow[] = events.map((e) => ({
      id: e.id,
      createdAt: e.createdAt.toISOString(),
      type: e.type,
      message: e.message || "",
      requestId: e.requestId,
      trackingCode: e.request?.trackingCode || null,
      actorId: e.actorId,
      actorEmail: e.actor?.email || null,
      actorName: e.actor?.name || null,
      actorRole: e.actorRole || null,
    }));

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return { ok: true, rows, total, totalPages, page, pageSize };
  } catch (error) {
    return {
      ok: false,
      message: getFriendlyErrorMessage(error),
    };
  }
};

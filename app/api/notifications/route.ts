import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export async function GET() {
  const { session } = await requireVerifiedUser();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { items: [], unreadCount: 0 },
      { status: 401 },
    );
  }

  const items = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const unreadCount = await db.notification.count({
    where: { userId, readAt: null },
  });

  return NextResponse.json({ items, unreadCount }, { status: 200 });
}

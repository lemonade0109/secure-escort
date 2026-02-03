import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { session } = await requireVerifiedUser();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationId = params.id;

    // Delete only if it belongs to the user
    await db.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}

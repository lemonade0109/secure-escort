import { db } from "@/db/db";
import { $Enums } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type CreateNotificationInput = {
  userId: string;
  type?: $Enums.NotificationType;
  title: string;
  message: string;
  href?: string;
};

export const createNotificationAction = async (
  input: CreateNotificationInput,
) => {
  await db.notification.create({
    data: {
      userId: input.userId,
      type: input.type || "SYSTEM",
      title: input.title,
      message: input.message,
      href: input.href || null,
    },
  });

  revalidatePath("/dashboard")
  revalidatePath("/notifications")
  revalidatePath("/admin")
  revalidatePath("/guard")
};


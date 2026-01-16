"use server";
import { db } from "@/db/db";

export const getTrackingCodeAction = async ({ code }: { code: string }) => {
  const requestCode = decodeURIComponent(code).trim().toLowerCase();

  // Use case-insensitive search for trackingCode
  const request = await db.request.findFirst({
    where: {
      trackingCode: {
        equals: requestCode,
        mode: "insensitive",
      },
    },
  });

  return request;
};

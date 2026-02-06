"use server";

import { db } from "@/db/db";
import { requireVerifiedUser } from "@/lib/auth/require-verified-user";
import { getFriendlyErrorMessage } from "@/lib/utils";
import { createReviewSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";
import { revalidatePath } from "next/cache";

export const createReviewAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const { session } = await requireVerifiedUser();
    const userId = session?.user?.id;
    const raw = Object.fromEntries(formData);
    const { requestId, rating, comment } = validateWithZodSchema(
      createReviewSchema,
      raw,
    );

    const req = await db.request.findUnique({
      where: { id: requestId },
      select: { id: true, guardId: true, userId: true, status: true },
    });

    if (!req)
      return {
        success: false,
        message: "Request not found",
      };
    if (req.userId !== userId)
      return {
        success: false,
        message: "You can only review your own requests",
      };
    if (req.status !== "COMPLETED")
      return {
        success: false,
        message: "You can only review completed requests",
      };
    if (!req.guardId)
      return {
        success: false,
        message: "No guard assigned to this request",
      };

    const existingReview = await db.review.findFirst({
      where: { requestId },
    });

    if (existingReview) {
      await db.review.update({
        where: { id: existingReview.id },
        data: { rating, comment: comment || null },
      });
    } else {
      await db.review.create({
        data: {
          requestId,
          userId,
          guardId: req.guardId,
          rating,
          comment: comment || null,
        },
      });
    }

    revalidatePath(`/request/${requestId}`);
    revalidatePath(`/guard/jobs/${requestId}`);
    revalidatePath(`/admin/request/${requestId}`);

    return {
      success: true,
      message: "Thanks! Your review has been submitted.",
    };
  } catch (error) {
    return {
      success: false,
      message: getFriendlyErrorMessage(error) || "Failed to submit review",
    };
  }
};

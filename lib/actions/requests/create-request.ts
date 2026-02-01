"use server";

import { auth } from "@/auth";
import { db } from "@/db/db";
import {
  getFriendlyErrorMessage,
  makeTrackingCode,
  renderError,
} from "@/lib/utils";
import { createRequestSchema, validateWithZodSchema } from "@/lib/validators";
import { FormActionState } from "@/types";
import { createRequestEvent } from "../timeline/create-request-events";
import { createNotificationAction } from "../notifications/create-notifications";
import { getAdminEmails } from "@/lib/admin";

export const CreateRequestAction = async (
  prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "Please sign in to create a request.",
      };
    }

    const rawData = Object.fromEntries(formData);
    const validatedData = validateWithZodSchema(createRequestSchema, rawData);

    const notes = (validatedData.notes ?? "").toString().trim();
    const trackingCode = makeTrackingCode("SE");

    // Save to database
    const created = await db.request.create({
      data: {
        userId,
        type: validatedData.type,
        status: "PENDING",
        trackingCode,
        details: {
          ...validatedData,
          notes: notes.length > 0 ? notes : undefined,
        },
      },
      select: { id: true },
    });

    //Notification to the admin

    // Notification to Admin
    const adminEmails = getAdminEmails();
    const adminUsers = await db.user.findMany({
      where: { email: { in: adminEmails } },
      select: { id: true },
    });

    // Send notifications to all admins
    for (const admin of adminUsers) {
      await createNotificationAction({
        userId: admin.id,
        title: `New Request Created: ${trackingCode}`,
        message: `A new request has been created with tracking code ${trackingCode}.`,
        type: "REQUEST_CREATED",
        href: `/admin/requests/${created.id}`,
      });
    }

    //Timeline Event
    await createRequestEvent({
      requestId: created.id,
      type: "REQUEST_CREATED",
      meta: {},
      actorId: userId,
      actorEmail: session.user?.email || null,
      actorName: session.user?.name || null,
      actorRole: "USER",
      message: `Request created with tracking code ${trackingCode}.`,
    });
    return {
      success: true,
      message: "Request submitted successfully.",
      redirectTo: `/request/${created.id}`,
    };
  } catch (error) {
    return {
      //To use renderError for dev Debugging
      success: false,
      message: getFriendlyErrorMessage(error) || renderError(error).message,
    };
  }
};

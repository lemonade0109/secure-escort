export const serviceRecommender = (data: {
  hasPickup?: boolean;
  hasDropoff?: boolean;
  itemDescription?: string;
  durationHours?: number;
  userText?: string;
  notes?: string;
  pickup?: string;
  dropoff?: string;
  location?: string;
}) => {
  const text = `${data.userText || ""} ${data.notes || ""}`.toLowerCase();

  const hasDeliveryIntent =
    /\b(deliver|delivery|drop\s?off|dispatch|send|ship|courier|package|parcel|document|documents|file|item|goods)\b/.test(
      text,
    );

  const hasSecurityIntent =
    /\b(personal\s*security|personal\s*body\s*guard|body\s*guard|bodyguard|security\s*detail|close\s*protection|guard\s*me|protect|protection|secure\s*me|threat|risky|high\s*risk)\b/.test(
      text,
    );

  const hasEscortIntent =
    /\b(escort|accompany|move\s*me|take\s*me|going\s*to|travel\s*to|route)\b/.test(
      text,
    );

  const hasRouteContext =
    !!data.pickup ||
    !!data.dropoff ||
    !!data.location ||
    (data.hasPickup ?? false) ||
    (data.hasDropoff ?? false);

  if (hasDeliveryIntent || data.itemDescription) {
    return "DELIVERY";
  }

  if (hasSecurityIntent || (data.durationHours && data.durationHours > 1)) {
    return "PERSONAL_SECURITY";
  }

  if (
    hasEscortIntent ||
    (data.hasPickup && data.hasDropoff) ||
    hasRouteContext
  ) {
    return "ESCORT";
  }

  return "ESCORT";
};

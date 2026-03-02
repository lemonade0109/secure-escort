export const serviceRecommender = (data: {
  hasPickup?: boolean;
  hasDropoff?: boolean;
  itemDescription?: string;
  durationHours?: number;
}) => {
  if (data.itemDescription) {
    return "DELIVERY";
  }

  if (data.hasPickup && data.hasDropoff) {
    return "ESCORT";
  }

  if (data.durationHours && data.durationHours > 1) {
    return "PERSONAL_SECURITY";
  }

  return "ESCORT";
};

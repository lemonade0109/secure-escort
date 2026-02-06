import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface GuardRatingCardProps {
  average: number;
  total: number;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}
const GuardRatingCard: React.FC<GuardRatingCardProps> = ({
  average,
  total,
  reviews,
}) => {
  return (
  <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-end gap-2">
          <div className="text-2xl font-semibold">{average.toFixed(1)}</div>

          <div className="text-sm text-white/60">
            / 5.0 {total} review{total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Recent comments */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-white/60">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="p-3 border rounded-xl border-white/10 bg-white/3"
              >
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{review.user.name ?? "User"}</span>
                  <span>{review.rating}</span>
                </div>

                {review.comment && (
                  <p className="mt-2 text-sm text-white/80">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardRatingCard;

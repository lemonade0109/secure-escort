"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormContainer from "../shared/form/form-container";
import { createReviewAction } from "@/lib/actions/reviews/create-review";
import { Button } from "../ui/button";

const ReviewCard: React.FC<{
  requestId: string;
}> = ({ requestId }) => {
  const [rating, setRating] = React.useState(5);

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Rate your experience</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormContainer action={createReviewAction} className="space-y-4">
          {(state) => (
            <>
              <input type="hidden" name="requestId" value={requestId} />
              <input type="hidden" name="rating" value={String(rating)} />

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={[
                      "size-9 rounded-lg border text-sm font-semibold",
                      star <= rating
                        ? "border-gold bg-gold/20 text-gold"
                        : "border-white/10 bg-white/3 text-white/60 hover:bg-white/5",
                    ].join(" ")}
                    aria-label={`Rate ${star}`}
                  >
                    {star}★
                  </button>
                ))}
              </div>

              <textarea
                name="comment"
                rows={3}
                placeholder="Optional comment (what went well / what to improve)"
                className="w-full p-3 text-sm text-white border outline-none rounded-xl border-white/10 bg-white/3 placeholder:text-white/40 focus:border-white/20"
              />

              <Button
                type="submit"
                className="w-full text-black bg-gold hover:bg-gold/90"
              >
                Submit Review
              </Button>

              {state?.success === false ? (
                <p className="text-xs text-destructive">
                  {String(state.message)}
                </p>
              ) : null}
            </>
          )}
        </FormContainer>

        <p className="text-xs text-white/60">
          Your feedback help us improve guard quality and service speed.
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

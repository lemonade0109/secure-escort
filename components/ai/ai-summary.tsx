"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockGenerateRequestSummary } from "@/lib/ai/ai-mock/generate-request-summary-mock";

export default function AdminAiSummaryCard({
  requestId,
}: {
  requestId: string;
}) {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await mockGenerateRequestSummary(requestId);
      if (res.success) {
        setSummary(res.summary ?? "");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="text-white border-white/10 bg-white/4 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-base">AI Timeline Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full text-black bg-gold hover:bg-gold/90"
        >
          {loading ? "Generating..." : "Generate Summary"}
        </Button>

        {summary && (
          <div className="text-sm whitespace-pre-wrap text-white/80">
            {summary}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

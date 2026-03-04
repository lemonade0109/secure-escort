"use client";

import { recommendServiceAction } from "@/lib/ai/recommend-service-action";
import React from "react";
import { Button } from "../ui/button";
import { Sparkles, X } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

type Msg = { role: "user" | "assistant"; content: string };

const ServiceRecommenderWidget = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [recommended, setRecommended] = React.useState<
    "ESCORT" | "DELIVERY" | "PERSONAL_SECURITY" | null
  >(null);

  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Tell me what you need in plain language, and I’ll suggest the safest service. For example: \"I need to move from Lekki to Ikeja around 10pm\" or \"I want to send legal documents to VI this afternoon.\"",
    },
  ]);

  async function onSend() {
    const prompt = text.trim();
    if (!prompt) return;

    setText("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      // minimal "structured" data from chat for now
      const payload = {
        userText: prompt,

        pickup: null,
        dropoff: null,
        location: null,
        time: null,
        itemDescription: null,
        estimatedValue: null,
        date: null,
        durationHours: null,
        notes: prompt,
      };

      const res = await recommendServiceAction(payload);

      setRecommended(
        res.service as "ESCORT" | "DELIVERY" | "PERSONAL_SECURITY" | null,
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.explanation },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn’t process that properly just now. Please resend with your location, destination (if any), and preferred time.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {/* Floating button */}

      {!open && (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed text-black rounded-full shadow-lg bottom-4 right-4 z-60 bg-gold hover:bg-gold/90"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Help me choose a service
        </Button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-60 w-90 max-w-[92vw]">
          <Card className="border-white/10 bg-[#070a12]/95 backdrop-blur-xl text-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="font-medium">Service Assistant</div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3 space-y-3 overflow-auto max-h-80">
              {messages.map((msg, idx) => (
                <div
                  className={`text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "text-gray-400"}`}
                  key={idx}
                >
                  <span className="mr-2 text-xs tracking-widest uppercase text-white/40">
                    {msg.role === "user" ? "You" : "Assistant"}
                  </span>
                  {msg.content}
                </div>
              ))}

              {recommended && (
                <div className="px-3 py-2 mt-2 text-sm border rounded-lg border-white/10 bg-white/5">
                  <div className="text-xs tracking-widest uppercase text-white/50">
                    Recommended
                  </div>

                  <div className="mt-1 font-semibold">
                    {recommended === "ESCORT"
                      ? "Escort Service"
                      : recommended === "DELIVERY"
                        ? "Delivery Service"
                        : "Personal Security Service"}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button
                      className="text-black bg-gold hover:bg-gold/90"
                      onClick={() => {
                        const type = recommended;
                        window.location.href = `/request/new?type=${type}`;
                      }}
                    >
                      Proceed with this service
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 px-4 py-3 border-t border-white/10">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe what you need..."
                className="text-white bg-white/5 border-white/10 placeholder:text-white/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSend();
                }}
                disabled={loading}
              />
              <Button
                onClick={onSend}
                disabled={loading}
                className="text-black bg-gold hover:bg-gold/90"
              >
                {loading ? "Thinking..." : "Send"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ServiceRecommenderWidget;

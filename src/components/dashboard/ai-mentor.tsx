"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOfficeStore } from "@/lib/store/office-state";

interface AiMentorProps {
  persona?: string; // "PM", "HR", "TECH_LEAD"
}

interface Message {
  id: string;
  role: string;
  content: string;
}

export function AiMentor({ persona = "PM" }: AiMentorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const projectId = useOfficeStore((state) => state.activeProjectId);

  const personaNames: Record<string, string> = {
    "PM": "AI Project Manager",
    "HR": "AI HR",
    "TECH_LEAD": "AI Tech Lead",
  };

  useEffect(() => {
    // Fetch memory
    fetch(`/api/ai/memory?persona=${persona}&projectId=${projectId || ""}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.memories) {
          setMessages(data.memories);
        }
      })
      .catch((err) => console.error("Failed to load memory", err));
  }, [persona, projectId]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setLoading(true);

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMsg },
    ]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, projectId, message: userMsg }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, data.response]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Sparkles size={18} className="text-teal-400" />
        <h3 className="font-semibold text-lg tracking-tight">{personaNames[persona] || "AI Mentor"}</h3>
      </div>

      <div className="flex-1 rounded-2xl border border-teal-500/30 bg-gradient-to-b from-teal-500/5 to-transparent p-5 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-none pb-4">
          {messages.length === 0 ? (
            <p className="text-[14px] font-medium text-foreground mb-4 leading-relaxed">
              I am online and ready to assist. How can I help you today?
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-3 py-2 rounded-lg text-[13px] max-w-[90%] ${
                  msg.role === "user" 
                    ? "bg-lwt-blue text-white" 
                    : "bg-muted text-foreground/90 border border-border/50"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-start">
               <div className="px-3 py-2 rounded-lg text-[13px] bg-muted text-foreground/50 border border-border/50 animate-pulse">
                Thinking...
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 relative shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything..." 
          className="w-full h-11 pl-4 pr-12 rounded-xl border border-border/60 bg-card focus:outline-none focus:ring-2 focus:ring-lwt-blue/50 text-sm shadow-sm"
          disabled={loading}
        />
        <button 
          onClick={sendMessage}
          disabled={loading}
          className="absolute right-1.5 top-1.5 w-8 h-8 flex items-center justify-center bg-lwt-blue text-white rounded-lg hover:bg-lwt-blue/90 transition-colors shadow-sm disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

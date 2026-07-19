import React, { useEffect, useState } from "react";
import { AiMentor } from "@/components/dashboard/ai-mentor";
import { Info } from "lucide-react";

export function HrBriefing() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/hr/briefing`);
        if (res.ok) {
          const data = await res.json();
          setBriefing(data.briefing);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="w-[800px] h-[500px] bg-background/95 backdrop-blur-md rounded-xl border shadow-2xl overflow-hidden flex pointer-events-auto">
      {/* Left side: AI HR Chat */}
      <div className="w-[400px] border-r flex flex-col bg-card">
        <div className="p-4 border-b font-bold bg-muted/50">AI HR Representative</div>
        <div className="flex-1 overflow-hidden p-4 relative">
          <AiMentor persona="HR" />
        </div>
      </div>

      {/* Right side: Briefing Data */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <Info className="text-primary" />
          <h2 className="text-2xl font-bold">Daily Briefing</h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        ) : (
          <div className="bg-secondary/50 rounded-lg p-6 border border-border">
            <p className="text-lg leading-relaxed">{briefing}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useOfficeStore } from "@/lib/store/office-state";
import { Calendar as CalendarIcon, Video } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
}

interface MentorSession {
  id: string;
  startTime: string;
}

export function CalendarWidget() {
  const activeProjectId = useOfficeStore(state => state.activeProjectId);
  const [data, setData] = useState<{ milestones: Milestone[], sessions: MentorSession[] }>({ milestones: [], sessions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/calendar${activeProjectId ? `?projectId=${activeProjectId}` : ""}`);
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [activeProjectId]);

  return (
    <div className="w-[400px] bg-background/95 backdrop-blur-md rounded-xl border shadow-2xl p-6 pointer-events-auto">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <CalendarIcon className="text-primary" />
        <h2 className="text-2xl font-bold">Today&apos;s Schedule</h2>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-lg w-full"></div>
          <div className="h-12 bg-muted rounded-lg w-full"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Meetings</h3>
            {data.sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No meetings scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {data.sessions.map((session: MentorSession) => (
                  <div key={session.id} className="p-3 border rounded-lg bg-card border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Mentorship Session</h4>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground text-xs py-1.5 rounded hover:bg-primary/90">
                        <Video className="w-3 h-3" /> Join Meeting
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Upcoming Deadlines</h3>
            {data.milestones.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-3">
                {data.milestones.map((m: Milestone) => (
                  <div key={m.id} className="p-3 border rounded-lg bg-card border-l-4 border-l-orange-500">
                    <h4 className="font-medium mb-1">{m.title}</h4>
                    <p className="text-xs text-muted-foreground">{new Date(m.dueDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

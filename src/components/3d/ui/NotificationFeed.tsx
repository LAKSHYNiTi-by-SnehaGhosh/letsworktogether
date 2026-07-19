import React, { useEffect, useState } from "react";
import { Bell, Activity } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
}

export function NotificationFeed() {
  const [data, setData] = useState<{ notifications: Notification[], activityLogs: ActivityLog[] }>({ notifications: [], activityLogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/notifications`);
        if (res.ok) setData(await res.json());
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="w-[350px] h-[500px] bg-background/95 backdrop-blur-md rounded-xl border shadow-2xl flex flex-col pointer-events-auto">
      <div className="flex items-center gap-2 p-4 border-b">
        <Bell className="text-primary w-5 h-5" />
        <h2 className="text-lg font-bold">Company Activity</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg w-full"></div>)}
          </div>
        ) : (
          <>
            {data.notifications.map(n => (
              <div key={n.id} className="p-3 border rounded-lg bg-card/50">
                <div className="font-semibold text-sm mb-1">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.message}</div>
                <div className="text-[10px] text-muted-foreground mt-2 text-right">{new Date(n.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
            {data.activityLogs.map(log => (
              <div key={log.id} className="flex gap-3 items-start text-sm py-2 border-b last:border-0">
                <div className="mt-1 bg-secondary p-1.5 rounded-full"><Activity size={12} className="text-muted-foreground"/></div>
                <div>
                  <div className="font-medium">{log.action.replace(/_/g, ' ')}</div>
                  <div className="text-xs text-muted-foreground">Entity: {log.entityType}</div>
                </div>
              </div>
            ))}
            {data.notifications.length === 0 && data.activityLogs.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-10">No recent activity</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

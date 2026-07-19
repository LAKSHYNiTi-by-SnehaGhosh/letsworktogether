import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

export function useWebSocket(url: string = "ws://localhost:8080") {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!user) return; // Wait until clerk user is loaded

    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      // Join the server
      socket.send(JSON.stringify({ 
        type: "JOIN", 
        userId: user.id, 
        name: user.fullName || "Developer" 
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);

        if (data.type === "SYNC_STATE") {
          setActiveUsers(data.users);
        } else if (data.type === "USER_JOINED") {
          setActiveUsers((prev) => {
            if (prev.find(u => u.id === data.user.id)) return prev;
            return [...prev, data.user];
          });
        } else if (data.type === "USER_LEFT") {
          setActiveUsers((prev) => prev.filter(u => u.id !== data.userId));
        } else if (data.type === "USER_MOVED") {
          setActiveUsers((prev) => 
            prev.map(u => u.id === data.userId ? { ...u, position: data.position, room: data.room } : u)
          );
        }
      } catch {
        setLastMessage(event.data);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [url, user]);

  const sendMessage = (data: unknown) => {
    if (ws.current && isConnected) {
      ws.current.send(typeof data === "string" ? data : JSON.stringify(data));
    }
  };

  const updatePosition = (position: [number, number, number], room: string) => {
    sendMessage({ type: "MOVE", position, room });
  };

  return { isConnected, lastMessage, sendMessage, activeUsers, updatePosition };
}

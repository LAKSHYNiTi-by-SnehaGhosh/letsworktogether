const { WebSocketServer } = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("LWT WebSocket Server Running");
});

const wss = new WebSocketServer({ server });

const users = new Map();

wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (message) => {
    try {
      const parsed = JSON.parse(message);
      
      if (parsed.type === "JOIN") {
        userId = parsed.userId || Math.random().toString(36).substring(7);
        users.set(userId, { 
          id: userId,
          name: parsed.name || "Developer",
          position: [0, 0, 0],
          room: parsed.room || "reception"
        });
        
        broadcast({ type: "USER_JOINED", user: users.get(userId) });
        ws.send(JSON.stringify({ type: "SYNC_STATE", users: Array.from(users.values()) }));
      }
      
      if (parsed.type === "MOVE") {
        if (userId && users.has(userId)) {
          const u = users.get(userId);
          u.position = parsed.position;
          u.room = parsed.room;
          broadcast({ type: "USER_MOVED", userId, position: u.position, room: u.room }, ws);
        }
      }

      if (parsed.type === "TASK_UPDATE") {
        broadcast({ type: "TASK_UPDATE", payload: parsed.payload }, ws);
      }

      if (parsed.type === "MEETING_START") {
        broadcast({ type: "MEETING_START", payload: parsed.payload }, ws);
      }
    } catch (e) {
      // raw message
      broadcast({ type: "RAW", data: message.toString() }, ws);
    }
  });

  ws.on("close", () => {
    if (userId) {
      users.delete(userId);
      broadcast({ type: "USER_LEFT", userId });
    }
  });

  function broadcast(data, excludeWs = null) {
    const msg = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === 1) {
        client.send(msg);
      }
    });
  }
});

const PORT = process.env.WS_PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = new Map(); // userId -> { ws, info: { id, name, position, room } }

wss.on('connection', (ws) => {
  let currentUserId = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'JOIN':
          currentUserId = data.userId;
          clients.set(currentUserId, {
            ws,
            info: { id: currentUserId, name: data.name, position: [0, 0, 0], room: 'reception' }
          });
          
          // Send all active users to the new user
          const activeUsers = Array.from(clients.values()).map(c => c.info);
          ws.send(JSON.stringify({ type: 'SYNC_STATE', users: activeUsers }));
          
          // Broadcast that a new user joined
          broadcast({ type: 'USER_JOINED', user: clients.get(currentUserId).info }, currentUserId);
          break;
          
        case 'MOVE':
          if (currentUserId && clients.has(currentUserId)) {
            const client = clients.get(currentUserId);
            client.info.position = data.position;
            client.info.room = data.room;
            broadcast({ type: 'USER_MOVED', userId: currentUserId, position: data.position, room: data.room }, currentUserId);
          }
          break;
          
        case 'EVENT':
          // Broadcast general events (e.g., Task Completed, Project Health Changed)
          broadcast({ type: 'EVENT', payload: data.payload }, currentUserId);
          break;
      }
    } catch (e) {
      console.error('WebSocket Error:', e);
    }
  });

  ws.on('close', () => {
    if (currentUserId) {
      clients.delete(currentUserId);
      broadcast({ type: 'USER_LEFT', userId: currentUserId });
    }
  });
});

function broadcast(messageObj, excludeUserId = null) {
  const messageString = JSON.stringify(messageObj);
  clients.forEach((client, userId) => {
    if (userId !== excludeUserId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageString);
    }
  });
}

console.log('WebSocket Server running on ws://localhost:8080');

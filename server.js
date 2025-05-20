// server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let sharedMarkdown = ''; // Shared Markdown content

wss.on('connection', (ws) => {
  // Send the current content to the newly connected client
  ws.send(sharedMarkdown);

  // Handle incoming messages
  ws.on('message', (message) => {
    sharedMarkdown = message; // Update shared content
    // Broadcast the updated content to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(sharedMarkdown);
      }
    });
  });
});

console.log('WebSocket server running on ws://localhost:8080');
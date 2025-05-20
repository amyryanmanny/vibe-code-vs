// server.js
import { WebSocketServer } from "ws";
import fs from "fs";
import http from "http";
import path from "path";

const wss = new WebSocketServer({ port: 8080 });

let sharedMarkdown = ''; // Shared Markdown content

wss.on('connection', (ws) => {
  // Send the current content to the newly connected client
  ws.send(sharedMarkdown);

  // Handle incoming messages
  ws.on('message', (message) => {
    sharedMarkdown = message.toString(); // Update shared content
    // Broadcast the updated content to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(sharedMarkdown);
      }
    });
  });
});

console.log('WebSocket server running on ws://localhost:8080');

// HTTP server to serve index.html
const httpServer = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(process.cwd(), "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

httpServer.listen(8000, () => {
  console.log("HTTP server running on http://localhost:8000");
});

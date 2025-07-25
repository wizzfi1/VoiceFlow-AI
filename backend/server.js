import 'dotenv/config';
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

wss.on("connection", (ws) => {
  console.log("🔗 WebSocket connected");

  let assemblyWs;

  const connectToAssemblyAI = async () => {
    const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
      method: "POST",
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({ expires_in: 3600 }),
    });

    const data = await response.json();
    const { token } = data;

    assemblyWs = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?token=${token}`);

    assemblyWs.onopen = () => {
      console.log("✅ Connected to AssemblyAI");
    };

    assemblyWs.onmessage = (message) => {
      const res = JSON.parse(message.data);
      if (res.text) {
        ws.send(res.text); // Forward transcript to frontend
      }
    };

    assemblyWs.onerror = (err) => {
      console.error("❌ AssemblyAI WebSocket error:", err);
    };
  };

  connectToAssemblyAI();

  ws.on("message", (msg) => {
    if (assemblyWs?.readyState === WebSocket.OPEN) {
      assemblyWs.send(msg);
    }
  });

  ws.on("close", () => {
    console.log("🛑 Client WebSocket closed");
    assemblyWs?.close();
  });
});

app.get("/", (req, res) => {
  res.send("🗣️ VoiceFlow backend is running!");
});

server.listen(PORT, () => {
  console.log(`✅ Express server running on http://localhost:${PORT}`);
});

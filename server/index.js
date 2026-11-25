import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import { ControlEvent, TikTokLiveConnection, WebcastEvent } from "tiktok-live-connector";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*", methods: ["GET"] } });
const PORT = process.env.PORT || 3000;
const TIKTOK_USERNAME = (process.env.TIKTOK_USERNAME || "chuanki10").replace(/^@/, "");
let bridgeStatus = { state: "starting", username: TIKTOK_USERNAME, message: "Menyiapkan koneksi TikTok LIVE." };
let totalComments = 0;
let activeConnection = null;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.get("/", (_req, res) => res.json({ service: "NGACOLOGY LIVE Bridge", ...bridgeStatus, totalComments }));
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
app.get("/status", (_req, res) => res.json({ ...bridgeStatus, totalComments }));

function setStatus(state, message) {
  bridgeStatus = { state, username: TIKTOK_USERNAME, message, updatedAt: new Date().toISOString() };
  io.emit("bridge:status", { ...bridgeStatus, totalComments });
  console.log("[bridge]", state, message);
}

io.on("connection", socket => {
  socket.emit("bridge:status", { ...bridgeStatus, totalComments });
  socket.on("keepalive", () => {});
});

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function runTikTokBridge() {
  while (true) {
    const connection = new TikTokLiveConnection(TIKTOK_USERNAME);
    activeConnection = connection;

    connection.on(WebcastEvent.CHAT, event => {
      const username = String(event.user?.displayId || event.user?.nickname || "Penonton").slice(0, 20);
      const commentText = String(event.content || "").slice(0, 100);
      if (!commentText.trim()) return;
      totalComments += 1;
      io.emit("tiktok:chat", {
        username,
        avatarUrl: event.user?.profilePicture?.url?.[0] || "",
        commentText,
        totalComments,
        receivedAt: new Date().toISOString()
      });
    });

    connection.on(ControlEvent.ERROR, ({ info, exception }) => {
      console.error("[TikTok]", info, exception?.message || "");
      setStatus("warning", String(info || exception?.message || "Gangguan koneksi TikTok."));
    });

    connection.on(ControlEvent.DISCONNECTED, event => {
      console.log("[TikTok] disconnected", event || "");
    });

    try {
      setStatus("waiting_live", "Menunggu @"+TIKTOK_USERNAME+" memulai LIVE.");
      await connection.waitUntilLive(45);
      setStatus("connecting", "LIVE terdeteksi. Menghubungkan pembaca komentar...");
      await connection.connect();
      setStatus("connected", "Terhubung ke LIVE @"+TIKTOK_USERNAME+". Menunggu komentar penonton.");
      await new Promise(resolve => connection.once(ControlEvent.DISCONNECTED, resolve));
      setStatus("reconnecting", "Koneksi terputus. Mencoba menyambung kembali...");
    } catch (error) {
      const message = String(error?.message || error || "Koneksi gagal.");
      setStatus("warning", message.slice(0, 180));
    } finally {
      try { await connection.disconnect(); } catch {}
      activeConnection = null;
    }
    await sleep(5000);
  }
}

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("NGACOLOGY LIVE Bridge listening on", PORT);
  runTikTokBridge().catch(error => {
    console.error("Bridge fatal error:", error);
    setStatus("error", String(error?.message || error));
  });
});

process.once("SIGTERM", async () => {
  try { await activeConnection?.disconnect(); } catch {}
  httpServer.close(() => process.exit(0));
});

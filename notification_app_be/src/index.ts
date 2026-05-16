import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db/index.js";
import { notificationRouter } from "./routes/notifications.js";
import { Log } from "./utils/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// ─── Global Middleware ────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ─── Request Logger Middleware ────────────────────────────────────────────────

app.use((req, _res, next) => {
  void Log(
    "backend",
    "info",
    "express",
    `${req.method} ${req.path} — ${new Date().toISOString()}`
  );
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/notifications", notificationRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  try {
    await initDB();
    app.listen(PORT, () => {
      void Log(
        "backend",
        "info",
        "server",
        `Notification API started on port ${PORT}`
      );
      console.log(`🚀 Notification API running at http://localhost:${PORT}`);
      console.log(`📋 Endpoints:`);
      console.log(`   GET    http://localhost:${PORT}/notifications`);
      console.log(`   POST   http://localhost:${PORT}/notifications`);
      console.log(`   GET    http://localhost:${PORT}/notifications/:id`);
      console.log(`   PATCH  http://localhost:${PORT}/notifications/:id/read`);
      console.log(`   DELETE http://localhost:${PORT}/notifications/:id`);
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await Log("backend", "error", "server", `Failed to start server: ${msg}`);
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

void bootstrap();

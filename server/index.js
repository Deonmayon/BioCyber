import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { checkDatabase } from "./db/pool.js";
import { initDatabase } from "./db/init.js";
import postsRouter from "./routes/posts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config();

const dataDir = path.join(__dirname, "data");
const clientDist = path.join(__dirname, "..", "client", "dist");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

async function readJson(filename) {
  const raw = await fs.readFile(path.join(dataDir, filename), "utf-8");
  return JSON.parse(raw);
}

app.get("/api/health", async (_req, res) => {
  const payload = { status: "ok", service: "biocyber-api" };
  try {
    payload.database = await checkDatabase();
  } catch {
    payload.database = "error";
  }
  res.json(payload);
});

app.get("/api/profile", async (_req, res, next) => {
  try {
    res.json(await readJson("profile.json"));
  } catch (err) {
    next(err);
  }
});

app.get("/api/certificates", async (_req, res, next) => {
  try {
    res.json(await readJson("certificates.json"));
  } catch (err) {
    next(err);
  }
});

app.use("/api/posts", postsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  try {
    await initDatabase();
  } catch (err) {
    console.error("Database init failed:", err.message);
    if (process.env.DATABASE_URL) process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`BioCyber API running on http://localhost:${PORT}`);
  });
}

start();

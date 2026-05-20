import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getPool, useDatabase } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCHEMA = `
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  read_minutes INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

export async function initDatabase() {
  if (!useDatabase()) {
    console.warn(
      "DATABASE_URL not set — blog CRUD disabled. Use JSON read fallback or run: docker compose up -d"
    );
    return;
  }

  const pool = getPool();
  await pool.query(SCHEMA);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM posts");
  if (rows[0].count > 0) return;

  const seedPath = path.join(__dirname, "..", "data", "posts.json");
  const raw = await fs.readFile(seedPath, "utf-8");
  const posts = JSON.parse(raw);

  if (posts.length === 0) return;

  for (const post of posts) {
    await pool.query(
      `INSERT INTO posts (slug, title, excerpt, content, tags, published_at, read_minutes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [
        post.slug,
        post.title,
        post.excerpt,
        post.content,
        post.tags,
        post.publishedAt,
        post.readMinutes,
      ]
    );
  }

  console.log(`Seeded ${posts.length} blog post(s) into PostgreSQL`);
}

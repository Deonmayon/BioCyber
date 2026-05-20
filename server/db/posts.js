import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getPool, useDatabase } from "./pool.js";
import { estimateReadMinutes, rowToPost, slugify } from "../utils/postHelpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsJsonPath = path.join(__dirname, "..", "data", "posts.json");

async function readJsonPosts() {
  const raw = await fs.readFile(postsJsonPath, "utf-8");
  return JSON.parse(raw);
}

export async function listPosts() {
  if (useDatabase()) {
    const { rows } = await getPool().query(
      `SELECT slug, title, excerpt, tags, published_at, read_minutes
       FROM posts
       ORDER BY published_at DESC`
    );
    return rows.map(rowToPost);
  }

  const posts = await readJsonPosts();
  return posts
    .map(({ slug, title, excerpt, tags, publishedAt, readMinutes }) => ({
      slug,
      title,
      excerpt,
      tags,
      publishedAt,
      readMinutes,
    }))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

export async function getPostBySlug(slug) {
  if (useDatabase()) {
    const { rows } = await getPool().query(
      "SELECT * FROM posts WHERE slug = $1",
      [slug]
    );
    return rows[0] ? rowToPost(rows[0]) : null;
  }

  const posts = await readJsonPosts();
  const post = posts.find((p) => p.slug === slug);
  return post ?? null;
}

export async function createPost(input) {
  const pool = getPool();
  const slug = input.slug?.trim() || slugify(input.title);
  const readMinutes = estimateReadMinutes(input.content);
  const publishedAt = input.publishedAt || new Date().toISOString().slice(0, 10);
  const tags = Array.isArray(input.tags) ? input.tags : [];

  const { rows } = await pool.query(
    `INSERT INTO posts (slug, title, excerpt, content, tags, published_at, read_minutes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [slug, input.title, input.excerpt, input.content, tags, publishedAt, readMinutes]
  );

  return rowToPost(rows[0]);
}

export async function updatePost(slug, input) {
  const pool = getPool();
  const existing = await getPostBySlug(slug);
  if (!existing) return null;

  const newSlug = input.slug?.trim() || slug;
  const readMinutes = estimateReadMinutes(input.content);
  const publishedAt = input.publishedAt || existing.publishedAt;
  const tags = Array.isArray(input.tags) ? input.tags : [];

  const { rows } = await pool.query(
    `UPDATE posts
     SET slug = $1,
         title = $2,
         excerpt = $3,
         content = $4,
         tags = $5,
         published_at = $6,
         read_minutes = $7,
         updated_at = NOW()
     WHERE slug = $8
     RETURNING *`,
    [
      newSlug,
      input.title,
      input.excerpt,
      input.content,
      tags,
      publishedAt,
      readMinutes,
      slug,
    ]
  );

  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function deletePost(slug) {
  const pool = getPool();
  const { rowCount } = await pool.query("DELETE FROM posts WHERE slug = $1", [
    slug,
  ]);
  return rowCount > 0;
}

export function requireDatabase(res) {
  if (!useDatabase()) {
    res.status(503).json({
      error:
        "PostgreSQL not configured. Start Docker: docker compose up -d and set DATABASE_URL in .env",
    });
    return false;
  }
  return true;
}

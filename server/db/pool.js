import pg from "pg";

const { Pool } = pg;

let pool = null;

export function useDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!useDatabase()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return pool;
}

export async function checkDatabase() {
  const db = getPool();
  if (!db) return "not_configured";
  await db.query("SELECT 1");
  return "connected";
}

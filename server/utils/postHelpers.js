export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function estimateReadMinutes(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function rowToPost(row) {
  const publishedAt =
    row.published_at instanceof Date
      ? row.published_at.toISOString().slice(0, 10)
      : String(row.published_at).slice(0, 10);

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags ?? [],
    publishedAt,
    readMinutes: row.read_minutes,
  };
}

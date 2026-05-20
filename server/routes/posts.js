import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostBySlug,
  listPosts,
  requireDatabase,
  updatePost,
} from "../db/posts.js";
import { slugify } from "../utils/postHelpers.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await listPosts());
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await getPostBySlug(req.params.slug);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  if (!requireDatabase(res)) return;

  try {
    const { title, excerpt, content, tags, publishedAt, slug } = req.body ?? {};

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      res.status(400).json({ error: "title, excerpt, and content are required" });
      return;
    }

    const post = await createPost({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: normalizeTags(tags),
      publishedAt,
      slug: slug?.trim() || slugify(title),
    });

    res.status(201).json(post);
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    next(err);
  }
});

router.put("/:slug", async (req, res, next) => {
  if (!requireDatabase(res)) return;

  try {
    const { title, excerpt, content, tags, publishedAt, slug: newSlug } =
      req.body ?? {};

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      res.status(400).json({ error: "title, excerpt, and content are required" });
      return;
    }

    const post = await updatePost(req.params.slug, {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: normalizeTags(tags),
      publishedAt,
      slug: newSlug?.trim(),
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json(post);
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "A post with this slug already exists" });
      return;
    }
    next(err);
  }
});

router.delete("/:slug", async (req, res, next) => {
  if (!requireDatabase(res)) return;

  try {
    const removed = await deletePost(req.params.slug);
    if (!removed) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export default router;

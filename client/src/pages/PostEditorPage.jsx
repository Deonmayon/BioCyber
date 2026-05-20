import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPost, getPost, updatePost } from "../api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tags: "",
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function PostEditorPage() {
  const { slug } = useParams();
  const isEdit = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    getPost(slug)
      .then((post) => {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags.join(", "),
          publishedAt: post.publishedAt,
        });
      })
      .catch(() => setError("Could not load post for editing."))
      .finally(() => setLoading(false));
  }, [isEdit, slug]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt,
      content: form.content,
      tags: form.tags,
      publishedAt: form.publishedAt,
    };

    try {
      const saved = isEdit
        ? await updatePost(slug, payload)
        : await createPost(payload);
      navigate(`/blog/${saved.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <section className="max-w-3xl">
      <Link
        to="/blog"
        className="text-sm text-slate-500 transition-colors hover:text-blue-600"
      >
        ← Back to blog
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        {isEdit ? "Edit post" : "New post"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Requires PostgreSQL running locally (
        <code className="rounded bg-blue-50 px-1 text-blue-700">npm run db:up</code>
        ).
      </p>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title *</span>
          <input
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Slug (URL) — leave blank to auto-generate
          </span>
          <input
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="buffer-overflow-101"
            className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Excerpt *</span>
          <textarea
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Tags (comma-separated)
          </span>
          <input
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            placeholder="pwn, linux, beginner"
            className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Published date</span>
          <input
            type="date"
            value={form.publishedAt}
            onChange={(e) => updateField("publishedAt", e.target.value)}
            className="ml-2 mt-1 rounded-lg border border-blue-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Content (Markdown) *
          </span>
          <textarea
            required
            rows={14}
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
          </button>
          <Link
            to="/blog"
            className="rounded-lg border border-blue-200 px-5 py-2 text-sm text-blue-700 hover:bg-blue-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

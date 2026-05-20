import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { deletePost, getPost } from "../api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";

export default function PostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPost(slug)
      .then(setPost)
      .catch(() => setError("Post not found or API unavailable."))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleDelete() {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setDeleting(true);
    setError(null);

    try {
      await deletePost(slug);
      navigate("/blog");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <Loading />;
  if (error && !post) return <ErrorMessage message={error} />;
  if (!post) return null;

  return (
    <article className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/blog"
          className="text-sm text-slate-500 transition-colors hover:text-blue-600"
        >
          ← Back to blog
        </Link>
        <div className="flex gap-3 text-sm">
          <Link
            to={`/blog/${slug}/edit`}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-800 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <header className="mt-6 border-b border-blue-100 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blue-50 px-3 py-0.5 text-xs text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose mt-8 max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

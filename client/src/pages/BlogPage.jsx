import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(() => setError("Could not load blog posts."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">CTF & Challenge Writeups</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Notes from boxes, pwn challenges, and web labs — written like a blog,
            not a README dump.
          </p>
        </div>
        <Link
          to="/blog/new"
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New post
        </Link>
      </div>

      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border-b border-blue-100 pb-8 last:border-0"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
              <Link to={`/blog/${post.slug}`} className="group block flex-1">
                <h2 className="text-2xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                  {post.title}
                </h2>
                <p className="mt-2 leading-relaxed text-slate-600">{post.excerpt}</p>
              </Link>
              <Link
                to={`/blog/${post.slug}/edit`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-3 py-0.5 text-xs text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

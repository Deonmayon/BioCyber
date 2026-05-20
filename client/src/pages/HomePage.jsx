import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError("Could not load profile. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!profile) return null;

  return (
    <section className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100/80 p-8 md:p-12 shadow-sm">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
        <p className="font-mono text-sm text-blue-600">$ whoami</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg font-medium text-blue-700">{profile.title}</p>
        <p className="mt-4 max-w-2xl text-slate-600">{profile.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-white border border-blue-200 px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-50"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-white border border-blue-200 px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-50"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-slate-900">About</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{profile.about}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/certificates"
          className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-700">
            Certificates →
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Cybersecurity credentials and verification links.
          </p>
        </Link>
        <Link
          to="/blog"
          className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
        >
          <h3 className="text-lg font-semibold text-blue-600 group-hover:text-blue-700">
            CTF Blog →
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Writeups and challenge notes — Medium-style reading.
          </p>
        </Link>
      </div>
    </section>
  );
}

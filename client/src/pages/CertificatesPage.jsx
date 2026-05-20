import { useEffect, useState } from "react";
import { getCertificates } from "../api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";

const badgeStyles = {
  emerald: "from-blue-50 to-sky-50 border-blue-200 text-blue-800",
  cyan: "from-sky-50 to-blue-50 border-sky-200 text-sky-900",
  violet: "from-indigo-50 to-blue-50 border-indigo-200 text-indigo-900",
};

export default function CertificatesPage() {
  const [certs, setCerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertificates()
      .then(setCerts)
      .catch(() => setError("Could not load certificates."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-900">Certificates</h1>
      <p className="mt-2 text-slate-600">
        Credentials I have earned — edit{" "}
        <code className="rounded bg-blue-50 px-1.5 py-0.5 text-sm text-blue-700">
          server/data/certificates.json
        </code>{" "}
        to add yours.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {certs.map((cert) => {
          const style = badgeStyles[cert.badgeColor] ?? badgeStyles.cyan;
          return (
            <article
              key={cert.id}
              className={`rounded-xl border bg-gradient-to-br p-6 shadow-sm ${style}`}
            >
              <p className="font-mono text-xs uppercase tracking-wider text-blue-600/80">
                {cert.issuer} · {cert.year}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{cert.name}</h2>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
                >
                  View credential →
                </a>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

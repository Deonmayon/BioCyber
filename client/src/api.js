const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function fetchJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const getProfile = () => fetchJson("/api/profile");
export const getCertificates = () => fetchJson("/api/certificates");
export const getPosts = () => fetchJson("/api/posts");
export const getPost = (slug) => fetchJson(`/api/posts/${slug}`);
export const createPost = (data) =>
  fetchJson("/api/posts", { method: "POST", body: JSON.stringify(data) });
export const updatePost = (slug, data) =>
  fetchJson(`/api/posts/${slug}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePost = (slug) =>
  fetchJson(`/api/posts/${slug}`, { method: "DELETE" });

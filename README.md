# BioCyber

Personal cybersecurity portfolio: bio, certificates, and a Medium-style CTF blog with **PostgreSQL** for post management.

**Stack:** React + Tailwind CSS (Vite) · Node.js + Express · PostgreSQL (Docker locally, Render Postgres in production)

## Features

| Page | Description |
|------|-------------|
| **About** | Name, title, links (GitHub, LinkedIn) |
| **Certificates** | Showcase certs (JSON file) |
| **CTF Blog** | List, read, **create, edit, delete** posts (PostgreSQL) |

## Blog CRUD (PostgreSQL)

Posts are stored in Postgres when `DATABASE_URL` is set.

| Action | UI | API |
|--------|-----|-----|
| List / Read | Blog pages | `GET /api/posts`, `GET /api/posts/:slug` |
| Create | **+ New post** | `POST /api/posts` |
| Update | **Edit** on list or post | `PUT /api/posts/:slug` |
| Delete | **Delete** on post page | `DELETE /api/posts/:slug` |

Without `DATABASE_URL`, the API falls back to `server/data/posts.json` (read-only; writes return 503).

## Local development

### 1. Start PostgreSQL (Docker)

```bash
npm run db:up
```

### 2. Environment

Copy `.env.example` to `.env` in the project root:

### 3. Run app

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000
- Health: http://localhost:5000/api/health → `"database": "connected"`

On first start, sample posts from `server/data/posts.json` are seeded into the database.

### Production-style locally

```powershell
npm run build
$env:NODE_ENV="production"
$env:DATABASE_URL="postgresql://biocyber:biocyber@localhost:5432/biocyber"
npm start
```

## Deploy on Render.com

`render.yaml` provisions:

1. **PostgreSQL** (`biocyber-db`) — linked as `DATABASE_URL`
2. **Web service** — builds React, runs Express

Steps:

1. Push to GitHub, invite **`wichit2s`**.
2. Render → **New Blueprint** → connect repo (uses `render.yaml`).
3. After deploy, copy the **Live** URL.

Render sets `DATABASE_SSL=true` automatically for managed Postgres.

## Static content (still JSON)

- `server/data/profile.json`
- `server/data/certificates.json`
- `server/data/posts.json` — seed data only (not used after DB is seeded)

## Project structure

```
BioCyber/
├── client/              React frontend + post editor
├── server/
│   ├── db/              Pool, schema, posts repository
│   ├── routes/posts.js  CRUD API
│   └── data/            profile, certs, seed posts
├── docker-compose.yml   Local Postgres
├── render.yaml          Web + Postgres on Render
└── .github/workflows/ci.yml
```

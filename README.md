# test-site

A polished demo website used to show prospective clients what a professional
web presence looks like. **Not a real product** — it's a sales/demo artifact.

## Purpose

Give sales conversations something tangible to point at: a fast, modern,
responsive site with real routing, real data flow, and real polish — built on
the same stack we'd ship for a paying client.

## Stack

**Frontend**
- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config)
- React Router v7
- TanStack React Query v5
- Lucide React icons
- `@fontsource-variable/inter`
- ESLint 10 flat config

**Backend**
- Python 3.14+ (managed with `uv`)
- FastAPI + Uvicorn
- SQLAlchemy 2.1 (DeclarativeBase)
- Alembic 1.20 migrations
- Pydantic Settings (`.env`)
- SQLite (`backend/data/app.db`)

## Routes

| Path | Page |
|------|------|
| `/` | Home — hero, services grid, CTA |
| `/services` | Services index |
| `/services/:slug` | Service detail |
| `/about` | About |
| `/contact` | Contact form (POSTs to `/api/contact`) |
| `*` | 404 |

## API

| Method | Path | Notes |
|--------|------|-------|
| GET  | `/api/health` | liveness |
| GET  | `/api/services` | list |
| GET  | `/api/services/{slug}` | single |
| POST | `/api/services` | create |
| GET  | `/api/projects` | list (not used by UI currently) |
| GET  | `/api/testimonials` | list (not used by UI currently) |
| POST | `/api/contact` | submit message |
| GET  | `/api/contact` | list messages (dev helper) |
| POST | `/api/seed` | wipe + reinsert sample content |

## Development

### Option A — one command

```bash
./dev.sh
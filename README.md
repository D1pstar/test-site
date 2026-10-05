# test-site

A polished demo website used to show prospective clients what a professional web presence looks like. This is **not** a real product — it's a sales/demo artifact.

## Purpose

Give sales conversations something tangible to point at: a fast, modern, responsive site with real routing, real data flow, and real polish — built on the same stack we'd ship for a paying client.

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

## Project layout

    test-site/
    ├── backend/          # FastAPI app
    │   ├── alembic/      # migrations
    │   ├── app/          # application code
    │   │   ├── models/
    │   │   ├── schemas/
    │   │   └── routers/
    │   └── data/         # sqlite db (gitignored)
    ├── frontend/         # React + Vite app
    │   └── src/
    │       ├── components/
    │       ├── pages/
    │       ├── hooks/
    │       └── lib/
    └── README.md

## Development

Four terminals, side by side:

| Terminal | Purpose | Command |
|----------|---------|---------|
| 1 | Backend (uvicorn) | `cd backend && uv run uvicorn app.main:app --reload` |
| 2 | Frontend (vite) | `cd frontend && npm run dev` |
| 3 | git / alembic / uv / npm | ad-hoc |
| 4 | tests / curl / misc | ad-hoc |

Backend: http://localhost:8000
Frontend: http://localhost:5173 (proxies `/api` → backend)

## Status

Scaffolding in progress. See commit history for build log.
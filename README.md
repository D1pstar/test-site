# test-site
- `frontend/` React + Vite site and admin editor
- `backend/` FastAPI API (SQLite)
- `Dockerfile` builds both into one service (used for Railway)

## New client? Use the generator
    ./sitegen.sh
Opens a local tool (never deployed): describe the client, copy the prompt into any AI, paste the reply back,
preview, and it writes a ready-to-deploy project folder with the content already in it. See tools/sitegen/README.md.

## Local development
Backend (in backend/):
  uv sync
  uv run alembic upgrade head      # (fresh DB: uv run python bootstrap.py)
  uv run python -m app.create_admin --username client
  uv run uvicorn app.main:app --reload
Frontend (in frontend/):
  npm install
  npm run dev                      # http://localhost:5173, proxies /api to :8000

## Deploy on Railway
1. Push this folder to GitHub.
2. Railway -> New Project -> Deploy from GitHub repo. It finds the Dockerfile.
3. Service -> Volumes -> add a volume mounted at /data.
4. Service -> Variables:
     SECRET_KEY=<random 40+ characters>
     DATABASE_URL=sqlite:////data/app.db
     UPLOAD_DIR=/data/uploads
     ADMIN_USERNAME=client
     ADMIN_PASSWORD=<12+ characters>     (delete this variable after the first deploy)
5. Service -> Settings -> Networking -> Generate Domain. Open it, then /admin.

# ---- build the website ----
FROM node:22-slim AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- run API + website together ----
FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim
WORKDIR /app
COPY backend/pyproject.toml ./
RUN uv sync --no-dev
ENV PATH="/app/.venv/bin:$PATH" APP_ENV=production DEBUG=false STATIC_DIR=/app/static
COPY backend/ ./
COPY --from=web /web/dist /app/static
CMD ["sh", "-c", "python bootstrap.py && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'"]

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

FlowGenius is a Symfony 8.1 (PHP 8.4+) backend with a separate React 19 + TypeScript + Vite frontend (`frontend/`). It runs in Docker with PostgreSQL 18. The whole stack is orchestrated by `docker-compose.yaml` (project name `flowgenius`).

## Running the stack

Everything is meant to run inside Docker — there is no host-side PHP setup.

```bash
make up                              # docker compose up -d (build + start app + database)
docker compose up -d --build         # rebuild the image and start
make php-shell                        # shell into the app container (PHP service)
```

- App (nginx + php-fpm in one container) is served on **http://localhost:8080**.
- PostgreSQL 18 is exposed on **localhost:5432** (db/user/password all `app`).
- From the host, connect to the DB via `127.0.0.1:5432`. From inside the `app` container, the DB host is the service name **`database`** (Docker DNS) — this is what `DATABASE_URL` uses.

### Symfony console, Composer, migrations

Run these inside the `app` container (the source is bind-mounted, so changes to `composer.json` / new migrations land back on the host):

```bash
docker compose exec app php bin/console <command>
docker compose exec app composer <command>
docker compose exec app php bin/console doctrine:migrations:migrate
docker compose exec app php bin/console make:migration
```

### Frontend

The React app is fully separate. From `frontend/`:

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint
```

### Tests

No PHP test suite is configured yet (PHPUnit is not a declared dev dependency and there is no `tests/` directory), even though `composer.json` autoloads `App\Tests\` from `tests/`.

## Architecture

### Backend: modular / bounded-context layout

Code under `src/` is organized by **bounded context**, then by **layer**, not by technical type:

```
src/<Context>/<Layer>/...
  src/Shared/UI/REST/Controller/
  src/Assessment/Domain/              # Doctrine entities (mapped, see below)
  src/Assessment/UI/REST/Controller/
```

Current contexts: `Shared` and `Assessment`.

### Routing — context-scoped prefixes (important gotcha)

Routes are attribute-based but loaded per-context in `config/routes.yaml`, each with its own **prefix**:

- `src/Shared/UI/REST/Controller/` → prefix **`/v1/`**
- `src/Assessment/UI/REST/Controller/` → prefix **`/v1/assessment/`**

So a `#[Route('/foo')]` on a Shared controller actually answers at `/v1/foo`. The path in the attribute is **relative to the context prefix** — account for this when adding or reasoning about routes. A controller placed in a context directory but without a matching `routes.yaml` loader entry will not be routed.

### Doctrine / persistence

- ORM with PostgreSQL; connection comes from `DATABASE_URL` (`config/packages/doctrine.yaml`).
- Entities live in `src/Assessment/Domain` and are mapped via the **non-bundle "Scouting" mapping** (prefix `App\Assessment\Domain`, alias `Assessment`). Add new entities under a context's `Domain/` and ensure a corresponding mapping exists.
- `identity_generation_preferences` forces PostgreSQL `IDENTITY` columns.
- `src/Assessment/Domain/` is **excluded from the service container** (`config/services.yaml`) so domain entities are not registered as autowired services.

### Frontend ↔ backend

The frontend is a standalone Vite SPA in `frontend/` (own `node_modules`, `package.json`, lint/build). It is not built or served by the Symfony app or the Docker image.

## Docker build details

- `docker/Dockerfile` builds the app image: `php:8.5-fpm` base, **nginx 1.30** (from the official nginx repo) and **php-fpm run together in one container** (`CMD` starts php-fpm `-D` then nginx in the foreground). PHP extensions: `pdo_pgsql`, `pgsql`, `zip`.
- nginx config is baked in via `COPY docker/nginx.conf /etc/nginx/conf.d/default.conf`; its document root is `/var/www/flowgenius/public`.
- The **build context must be the repo root** (the Dockerfile does `COPY . /var/www/flowgenius` and `COPY docker/nginx.conf ...`). `.dockerignore` excludes `.git/`, `.idea/`, `var/`, `vendor/` — do **not** add `docker/` back to it or the nginx config COPY will silently break.
- In `docker-compose.yaml` the project is bind-mounted (`.:/var/www/flowgenius`), so the baked-in copy is shadowed by host files at runtime — keep a valid host `vendor/` (run `composer install` in the container after dependency changes).
- PostgreSQL 18 stores data in a version-specific subdir, so the volume is mounted at `/var/lib/postgresql` (the parent), **not** `/var/lib/postgresql/data`.
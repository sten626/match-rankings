# AGENTS.md — match-rankings

> Project context for AI coding agents (Kilo Code). Last updated: 2026-08-01

## Project Overview

A full-stack **Angular + Express** application for tracking **Glicko ratings** across
events. The backend manages players, events, and matches in a PostgreSQL database.

## Tech Stack

| Layer           | Tool / Library              |
| --------------- | --------------------------- |
| Package manager | pnpm (v11.x)                |
| Language        | TypeScript (ESNext)         |
| Runtime         | Node.js                     |
| Backend         | Express 5                   |
| Database        | PostgreSQL (via pg-promise) |
| Dev runner      | tsx (TS runner)             |
| Linting         | tsc --noEmit                |
| Formatting      | Prettier (defaults)         |

## Project Structure

<!-- TODO: Update once project structure stabilizes -->

Key directories/files:

- `server/` — Express backend (entry point: `server.ts`)
- `server/routes/` — route handlers
- `server/db/` — database connection + schema
- `server/middleware/` — Express middleware

Agents should inspect the filesystem directly rather than relying on a static tree here.

## Setup & Installation

```bash
pnpm install
pnpm dev
```

Ensure PostgreSQL is running and the `glicko` database exists.

Never execute anything on the database.

## Environment Variables

The server needs a `.env` file in `server/`:

```
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=glicko
DB_USER=<your_user>
DB_PASSWORD=<your_password>
PORT=3000
```

## Useful Commands (from server/ or with `pnpm --filter @match-rankings/server`)

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Start dev server with `tsx watch` |
| `pnpm typecheck` | Type-check (`tsc --noEmit`)       |
| `pnpm lint`      | Alias for typecheck               |

## Code Conventions

### TypeScript

- Strict mode: `strict`, `verbatimModuleSyntax`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`
- Use `import type` for type-only imports
- Imports use `.js` extensions (ESM-style): `from '../db/connection'`

### Express Routes

- Routes live in `server/routes/*.ts`
- Two patterns coexist (in-progress migration):
  1. **Direct router export** — `export { router }` (players, matches)
  2. **Factory function** — `export function createRouter(): Router` (events, health)
- Wrap async handlers with `asyncHandler` from `middleware/errorHandler`
- Use `Router({ mergeParams: true })` for child routers

### Database

- Access via `db` export from `db/connection.ts`
- Use pg-promise methods: `db.any()`, `db.oneOrNone()`, `db.one()`, `db.result()`
- Always use **parameterized queries** (`$1`, `$2`, …)

### Error Handling

- `errorHandler` middleware handles errors including pg-promise `QueryResultError` (→409)
- Errors can carry `.status` (e.g. 400, 404) for HTTP status codes
- TODO: Wire up error handler + remaining routes in `server.ts`

## API Endpoints

| Method | Path               | Handler        | Status        |
| ------ | ------------------ | -------------- | ------------- |
| GET    | `/api/players`     | players router | Active        |
| GET    | `/api/players/:id` | players router | Active        |
| GET    | `/api/events`      | events router  | Active        |
| GET    | `/api/events/:id`  | events router  | Active        |
| POST   | `/api/events`      | events router  | Active        |
| PUT    | `/api/events/:id`  | events router  | Active        |
| DELETE | `/api/events/:id`  | events router  | Active        |
| GET    | `/api/matches`     | matches router | Active        |
| GET    | `/api/matches/:id` | matches router | Active        |
| GET    | `/health`          | health router  | Commented out |

## Notes for Agents

- `players.ts` and `matches.ts` have full CRUD in comments — intended to be migrated to factory pattern
- `server.ts` has commented-out wiring for error handler, health, events, matches routes — only `players` is active
- Root `tsconfig.json` has `"types": []`; server config adds `"types": ["node"]`

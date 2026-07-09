# baseurl

Serverless base-URL resolver for Android apps (Elysia + Drizzle + Neon, deploy on Vercel).

## Endpoints

| Method | Path                | Auth        | Purpose                         |
|--------|---------------------|-------------|---------------------------------|
| GET    | `/resolve?name=foo` | **none**    | Android apps resolve a base URL |
| GET    | `/urls`             | Bearer key  | List all                        |
| POST   | `/urls`             | Bearer key  | Create `{name, url}`            |
| PUT    | `/urls/:name`       | Bearer key  | Edit `{url}`                    |

Protected routes need `Authorization: Bearer $API_KEY`.

## Setup

```bash
cp .env.example .env      # set DATABASE_URL (Neon) + API_KEY
bun run db:push           # create the `urls` table
bun run dev               # local: http://localhost:3000
```

## Deploy (Vercel)

Set `DATABASE_URL` and `API_KEY` in project env vars, then `vercel deploy`.
Uses the Neon HTTP driver (no pooling) — right for serverless functions.

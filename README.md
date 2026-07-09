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

## Deploy (Vercel — Dockerfile)

Vercel builds `Dockerfile.vercel` directly (Fluid compute). Set `DATABASE_URL`,
`API_KEY` (and optionally the Upstash vars) in project env, then `vercel deploy`.
The server listens on `$PORT` (Vercel defaults it to 80).

Plain `Dockerfile` is the same image for any other host (`docker run -p 3000:3000 --env-file .env`).

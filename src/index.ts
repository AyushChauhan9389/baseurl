import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { eq } from "drizzle-orm";
import { db, urls } from "./db";

const app = new Elysia()
  // Public — Android apps resolve without an API key: GET /resolve?name=foo
  .get(
    "/resolve",
    async ({ query, status }) => {
      const [row] = await db
        .select()
        .from(urls)
        .where(eq(urls.name, query.name));
      return row ?? status(404, { error: "not found" });
    },
    { query: t.Object({ name: t.String() }) }
  )

  // Everything below requires a Bearer API key
  .use(bearer())
  .onBeforeHandle(({ bearer, status }) => {
    if (bearer !== process.env.API_KEY) return status(401, { error: "unauthorized" });
  })

  .get("/urls", () => db.select().from(urls))

  .post(
    "/urls",
    async ({ body, status }) => {
      try {
        await db.insert(urls).values(body);
        return status(201, body);
      } catch {
        return status(409, { error: "name already exists" });
      }
    },
    { body: t.Object({ name: t.String({ minLength: 1 }), url: t.String() }) }
  )

  .put(
    "/urls/:name",
    async ({ params, body, status }) => {
      const updated = await db
        .update(urls)
        .set({ url: body.url })
        .where(eq(urls.name, params.name))
        .returning();
      return updated[0] ?? status(404, { error: "not found" });
    },
    { body: t.Object({ url: t.String() }) }
  );

// Vercel uses the default export; run standalone locally with `bun src/index.ts`
if (!process.env.VERCEL) app.listen(3000);

export default app;

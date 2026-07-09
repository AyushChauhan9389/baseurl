import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { eq } from "drizzle-orm";
import { db, urls } from "./db";
import { cacheGet, cacheSet, cacheDel } from "./cache";

const app = new Elysia()
  // Public — Android apps resolve without an API key: GET /resolve?name=foo
  .get(
    "/resolve",
    async ({ query, status }) => {
      const cached = await cacheGet(query.name);
      if (cached) return { name: query.name, url: cached };

      const [row] = await db
        .select()
        .from(urls)
        .where(eq(urls.name, query.name));
      if (!row) return status(404, { error: "not found" });

      await cacheSet(row.name, row.url);
      return row;
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
      if (!updated[0]) return status(404, { error: "not found" });

      await cacheDel(params.name); // invalidate stale cache
      return updated[0];
    },
    { body: t.Object({ url: t.String() }) }
  );

// Container mode (incl. Dockerfile-on-Vercel): listen on $PORT (Vercel defaults it to 80)
app.listen(Number(process.env.PORT) || 3000);

export default app;

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, text } from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
  name: text("name").primaryKey(),
  url: text("url").notNull(),
});

export const db = drizzle(neon(process.env.DATABASE_URL!), {
  schema: { urls },
});

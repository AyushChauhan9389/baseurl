import { Redis } from "@upstash/redis";

// Optional: no-op unless Upstash env vars are set (keeps local dev/tests working).
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? Redis.fromEnv()
  : null;

const key = (name: string) => `url:${name}`;
const TTL = 3600; // 1h

export const cacheGet = (name: string) =>
  redis?.get<string>(key(name)) ?? Promise.resolve(null);

export const cacheSet = (name: string, url: string) =>
  redis?.set(key(name), url, { ex: TTL }) ?? Promise.resolve();

export const cacheDel = (name: string) =>
  redis?.del(key(name)) ?? Promise.resolve();

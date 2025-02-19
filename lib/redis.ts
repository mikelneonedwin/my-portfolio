import type { KvMapper } from "@/types/db";
import { Redis } from "@upstash/redis";

type MgetReturn<T, K extends (keyof T)[]> = {
  [I in keyof K]: T[K[I]] | null;
};

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export const kv = {
  async set<T extends keyof KvMapper>(key: T, value: KvMapper[T]) {
    await redis.set(key, value);
  },
  async get<T extends keyof KvMapper>(key: T) {
    const data = await redis.get(key);
    return data as KvMapper[T] | null;
  },
  async getAll<K extends (keyof KvMapper)[]>(
    ...keys: K
  ): Promise<MgetReturn<KvMapper, K>> {
    const data = await redis.mget(...keys);
    return data as MgetReturn<KvMapper, K>;
  },
  async del(key: string) {
    await redis.del(key);
  },
  async setAll(data: Partial<KvMapper>) {
    await redis.mset(data);
  },
};

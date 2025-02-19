import type { KvMapper } from "@/types/db";
import { Redis } from "@upstash/redis";

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
  async getAll<T extends keyof KvMapper>(...keys: T[]) {
    const data: Partial<Pick<KvMapper, T>> = {};

    await Promise.all(
      keys.map(async (key) => {
        const val = await this.get(key);
        data[key] = val ?? undefined;
      })
    );

    return data;
  },
  async del(key: string) {
    await redis.del(key);
  },
};

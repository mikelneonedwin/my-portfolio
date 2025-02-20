import { NODE_ENV } from "@/constants";
import { adminKv } from "./firebase-admin";
import { redis } from "./redis";
import type { KvMapper } from "@/types/db";
import type { Kv, MgetReturn } from "@/types/kv";

export const kv: Kv = {
    async set(key, value) {
      switch (NODE_ENV) {
        case "development": {
          await adminKv.set(key, value);
          return;
        }
        case "production": {
          await redis.set(key, value);
          return;
        }
      }
    },
    async get(key) {
      const data =
        NODE_ENV === "development"
          ? await adminKv.get(key)
          : await redis.get(key);
      return data as KvMapper[typeof key] | null;
    },
    async getAll(...keys) {
      const data =
        NODE_ENV === "development"
          ? await adminKv.getAll(...keys)
          : await redis.mget(...keys);
      return data as MgetReturn<KvMapper, typeof keys>;
    },
    async del(key) {
      switch (NODE_ENV) {
        case "development": {
          await adminKv.del(key);
          return;
        }
        case "production": {
          await redis.del(key);
          return;
        }
      }
    },
    async setAll(data) {
      switch (NODE_ENV) {
        case "development": {
          await adminKv.setAll(data);
          return;
        }
        case "production": {
          await redis.mset(data);
          return;
        }
      }
    },
  };
  
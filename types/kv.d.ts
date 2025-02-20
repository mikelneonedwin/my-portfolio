import type { KvMapper } from "./db";

export type MgetReturn<T, K extends (keyof T)[]> = {
  [I in keyof K]: T[K[I]] | null;
};

export interface Kv {
  set<T extends keyof KvMapper>(key: T, value: KvMapper[T]): Promise<void>;
  get<T extends keyof KvMapper>(key: T): Promise<KvMapper[T] | null>;
  getAll<K extends (keyof KvMapper)[]>(
    ...keys: K
  ): Promise<MgetReturn<KvMapper, K>>;
  del<T extends keyof KvMapper>(key: T): Promise<void>;
  setAll(data: Partial<KvMapper>): Promise<void>;
}

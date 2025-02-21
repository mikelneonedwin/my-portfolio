import { NODE_ENV } from "@/constants";
import type { Database, KvMapper } from "@/types/db";
import type { Kv, MgetReturn } from "@/types/kv";
import {
  cert,
  getApps,
  initializeApp,
  type AppOptions,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getFirestore, type WhereFilterOp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import type { Insertable, Selectable } from "kysely";

const adminConfig: AppOptions = {
  credential: cert({
    clientEmail: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  }),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = getApps().length ? getApps()[0] : initializeApp(adminConfig);

export const adminAuth = getAuth(app);
export const adminStorage = getStorage(app);
export const adminDb = getFirestore(app);
export const database = getDatabase(app);

if (NODE_ENV === "development") {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "http://127.0.0.1:9099";
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = "127.0.0.1:9000";
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";
}

export function dbCollection<T extends keyof Database>(group: T) {
  type AppModel = Selectable<Database[T]>;
  type DbModel = Insertable<Database[T]>;
  const converted = adminDb.collection(group).withConverter<AppModel, DbModel>({
    // @ts-expect-error ...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toFirestore: ({ id, ...data }: AppModel): DbModel => data,
    fromFirestore(snapshot): AppModel {
      return snapshot.data() as AppModel;
    },
  });
  return {
    get: () => converted.get(),
    doc: (...args: Parameters<typeof converted.doc>) => converted.doc(...args),
    add: (...args: Parameters<typeof converted.add>) => converted.add(...args),
    where<K extends Extract<keyof AppModel, string>>(
      key: K,
      opStr: WhereFilterOp,
      value: AppModel[K]
    ) {
      return converted.where(key, opStr, value);
    },
  };
}

export const adminKv: Kv = {
  async del(key) {
    await database.ref(key).remove();
  },
  async get(key) {
    const snapshot = await database.ref(key).get();
    return snapshot.exists() ? snapshot.val() : null;
  },
  async set(key, value) {
    await database.ref(key).set(value);
  },
  async setAll(data) {
    await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        await database.ref(key).set(value);
      })
    );
  },
  async getAll(...keys) {
    const result = await Promise.all(
      keys.map(async (key) => {
        const snapshot = await database.ref(key).get();
        return snapshot.exists() ? snapshot.val() : null;
      })
    );
    return result as MgetReturn<KvMapper, typeof keys>;
  },
};

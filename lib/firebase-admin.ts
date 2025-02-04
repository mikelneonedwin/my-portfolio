import {
  cert,
  getApps,
  initializeApp,
  type AppOptions,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

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

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);
const adminStorage = getStorage(app);
const adminKv = getDatabase(app);

export { adminAuth, adminDb, adminKv, adminStorage };

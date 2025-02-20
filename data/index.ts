import { NODE_ENV } from "@/constants";
import { adminDbCollection } from "@/lib/firebase-admin";
import { pg } from "@/lib/pg";
import type { Skill, Social } from "@/types/db";
import "server-only";

export async function getSkills(): Promise<Skill[]> {
  switch (NODE_ENV) {
    case "development": {
      const snapshot = await adminDbCollection("skills").get();
      return snapshot.docs.map((doc) => doc.data());
    }
    case "production":
      return await pg.selectFrom("skills").selectAll().execute();
  }
}

export async function getSocials(): Promise<Social[]> {
  switch (NODE_ENV) {
    case "development":
      const snapshot = await adminDbCollection("socials").get();
      return snapshot.docs.map((doc) => doc.data());
    case "production":
      return await pg.selectFrom("socials").selectAll().execute();
  }
}

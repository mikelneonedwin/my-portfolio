import { NODE_ENV } from "@/constants";
import { dbCollection } from "@/lib/firebase-admin";
import { pg } from "@/lib/pg";
import type { Skill } from "@/types/db";
import "server-only";

export async function getSkills(): Promise<Skill[]> {
  switch (NODE_ENV) {
    case "development": {
      const snapshot = await dbCollection("skills").get();
      return snapshot.docs.map((doc) => doc.data());
    }
    case "production":
      return await pg.selectFrom("skills").selectAll().execute();
  }
}

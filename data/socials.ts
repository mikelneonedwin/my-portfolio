import { NODE_ENV } from "@/constants";
import { adminDbCollection } from "@/lib/firebase-admin";
import { pg } from "@/lib/pg";
import type { NewSocial, Social } from "@/types/db";
import type { PartialExcept } from "@/types/utils";

export async function setSocial({
  id,
  ...social
}: PartialExcept<NewSocial, "id">) {
  switch (NODE_ENV) {
    case "development": {
      await adminDbCollection("socials").doc(id.toString()).update(social);
      return;
    }
    case "production": {
      await pg
        .updateTable("socials")
        .where("socials.id", "=", id)
        .set(social)
        .executeTakeFirst();
      return;
    }
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

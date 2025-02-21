import { NODE_ENV } from "@/constants";
import { dbCollection } from "@/lib/firebase-admin";
import { pg } from "@/lib/pg";
import type { NewSocial, Social } from "@/types/db";

export async function setSocial(id: Social["id"], data: NewSocial) {
  switch (NODE_ENV) {
    case "development": {
      await dbCollection("socials").doc(id.toString()).update(data);
      return;
    }
    case "production": {
      await pg
        .updateTable("socials")
        .where("socials.id", "=", id)
        .set(data)
        .executeTakeFirst();
      return;
    }
  }
}

export async function getSocials(): Promise<Social[]> {
  switch (NODE_ENV) {
    case "development": {
      const snapshot = await dbCollection("socials").get();
      return snapshot.docs.map((doc) => doc.data());
    }
    case "production": {
      return await pg.selectFrom("socials").selectAll().execute();
    }
  }
}

export async function removeSocial(id: Social["id"]) {
  switch (NODE_ENV) {
    case "development": {
      await dbCollection("socials").doc(id.toString()).delete();
      return;
    }
    case "production": {
      await pg
        .deleteFrom("socials")
        .where("socials.id", "=", id)
        .executeTakeFirst();
      return;
    }
  }
}

export async function addSocial(data: NewSocial) {
  switch (NODE_ENV) {
    case "development": {
      const randId = Math.round(Math.random() * 1000);
      await dbCollection("socials")
        .doc(randId.toString())
        .set({
          ...data,
          id: randId,
        });
      return;
    }
    case "production": {
      await pg.insertInto("socials").values(data).executeTakeFirst();
      return;
    }
  }
}

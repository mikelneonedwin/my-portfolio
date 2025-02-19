import { TESTING } from "@/constants";
import { db } from "@/lib/sql";
import type { Social } from "@/types/db";
import { faker } from "@faker-js/faker";
import "server-only";

export async function getSkills() {
  return await db.selectFrom("skills").select(["name", "icon_url"]).execute();
}

export async function getSocials(): Promise<Social[]> {
  switch (TESTING) {
    case true:
      return [
        {
          id: faker.number.int(),
          name: faker.company.name(),
          url: faker.internet.url(),
        },
        {
          id: faker.number.int(),
          name: faker.company.name(),
          url: faker.internet.url(),
        },
      ];
    case false:
      return await db.selectFrom("socials").selectAll().execute();
  }
}

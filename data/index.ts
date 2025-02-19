import { db } from "@/lib/postgres";

export async function getSkills() {
  return await db.selectFrom("skills").select(["name", "icon_url"]).execute();
}

export async function getFeaturedProjects() {
  return await db.selectFrom("projects").where("featured", "=", true).execute();
}

export async function getSocials() {
  return await db.selectFrom("socials").selectAll().execute();
}

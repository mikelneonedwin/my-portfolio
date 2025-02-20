import type { Database } from "@/types/db";
import { createKysely } from "@vercel/postgres-kysely";

export const pg = createKysely<Database>();

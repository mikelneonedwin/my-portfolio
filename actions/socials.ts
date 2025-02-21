"use server";

import { addSocial, removeSocial, setSocial } from "@/data/socials";
import { serialIdSchema } from "@/schemas";
import { socialSchema } from "@/schemas/socials";
import type { NewSocial, Social } from "@/types/db";
import { authorize } from "@/utils/server";
import { serverErrorMessage } from "@/utils/server/errors";
import { revalidatePath } from "next/cache";

export async function updateSocial(
  token: string,
  id: Social["id"],
  data: NewSocial
) {
  try {
    await socialSchema.parseAsync(data);
    await serialIdSchema.parseAsync(id);
    await authorize(token);
    await setSocial(id, data);
    revalidatePath("/contact");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error updating social:`, error);
    return serverErrorMessage(error);
  }
}

export async function deleteSocial(token: string, id: Social["id"]) {
  try {
    await serialIdSchema.parseAsync(id);
    await authorize(token);
    await removeSocial(id);
    revalidatePath("/contact");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting social:", error);
    return serverErrorMessage(error);
  }
}

export async function createSocial(token: string, data: NewSocial) {
  try {
    await socialSchema.parseAsync(data);
    await authorize(token);
    await addSocial(data);
    revalidatePath("/contact");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating social:", error);
    return serverErrorMessage(error);
  }
}

"use server";

import { setSocial } from "@/data/socials";
import { idTokenSchema } from "@/schemas";
import { updateSocialSchema } from "@/schemas/socials";
import type { NewSocial } from "@/types/db";
import type { PartialExcept } from "@/types/utils";
import { authorize } from "@/utils/server";
import { serverErrorMessage } from "@/utils/server/errors";

export async function updateSocial(
  token: string,
  data: PartialExcept<NewSocial, "id">
) {
  try {
    await idTokenSchema.parseAsync(token);
    await updateSocialSchema.parseAsync(data);
    await authorize(token);
    await setSocial(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error updating social:`, error);
    return serverErrorMessage(error);
  }
}

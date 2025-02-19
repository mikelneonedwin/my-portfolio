"use server";

import { addSocial, patchSocial, removeSocial } from "@/data";
import {
  idTokenSchema,
  platformSchema,
  socialIdSchema,
  socialUrlSchema,
} from "@/schemas";
import { authorize } from "@/utils/server";
import { getErrorMessage } from "@/utils/shared";
import { z } from "zod";

const createSocialSchema = z.object({
  platform: platformSchema,
  token: idTokenSchema,
  url: socialUrlSchema,
});

export async function createSocial(data: z.infer<typeof createSocialSchema>) {
  try {
    await createSocialSchema.parseAsync(data);
    await authorize(data.token);
    return await addSocial(data.platform, data.url);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating social:", err);
    return getErrorMessage(err);
  }
}

const deleteSocialSchema = z.object({
  id: socialIdSchema,
  token: idTokenSchema,
});

export async function deleteSocial(data: z.infer<typeof deleteSocialSchema>) {
  try {
    await deleteSocialSchema.parseAsync(data);
    await authorize(data.token);
    await removeSocial(data.id);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error while deleting social", err);
    return getErrorMessage(err);
  }
}

const updateSocialSchema = z.object({
  token: idTokenSchema,
  id: socialIdSchema,
  data: z.object({
    name: platformSchema,
    url: socialUrlSchema,
  }),
});

export async function updateSocial(data: z.infer<typeof updateSocialSchema>) {
  try {
    await updateSocialSchema.parseAsync(data);
    await authorize(data.token);
    await patchSocial(data.id, data.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating socials:", error);
    return getErrorMessage(error);
  }
}

import type { NewSocial } from "@/types/db";
import type { PartialExcept } from "@/types/utils";
import { z } from "zod";

export const newSocialSchema: z.Schema<NewSocial> = z.object({
  name: z.string().nonempty("Social platform name is required"),
  url: z.string().url("Invalid URL provided for the social platform"),
});

export const updateSocialSchema: z.Schema<PartialExcept<NewSocial, "id">> =
  z.object({
    id: z
      .number()
      .int()
      .nonnegative("Social ID must be a non-negative integer"),
    name: z
      .string()
      .min(1, "Social platform name must be a non-empty string if provided")
      .optional(),
    url: z
      .string()
      .url("Social platform URL must be a valid web address if provided")
      .optional(),
  });

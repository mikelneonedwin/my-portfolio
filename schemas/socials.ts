import type { NewSocial } from "@/types/db";
import { z } from "zod";

// Form schema
export const socialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  url: z.string().url("Must be a valid URL"),
}) satisfies z.ZodSchema<NewSocial>;

import type { Project } from "@/types/db";
import { z } from "zod";

export const idTokenSchema = z.string().min(1, "Invalid token");

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  live_url: z.string().url("Invalid live URL").optional(),
  github_url: z.string().url("Invalid GitHub URL").optional(),
  tools: z.string().min(1, "At least one tool is required").array(),
  company: z.string().nullable(),
  year: z.number().int("Invalid year").positive("Invalid year"),
  media: z.object({
    type: z.custom<NonNullable<Project["media"]>["type"]>((val) =>
      ["link", "image", "video"].includes(val)
    ),
    url: z.string().url(),
  }),
  featured: z.boolean(),
});

export const projectIdSchema = z.string().min(1, "Project ID is required");

export const socialIdSchema = z.string().min(1, "Social id is required");
export const platformSchema = z
  .string()
  .min(1, "A social media platform is required");
export const socialUrlSchema = z.string().url("Invalid social media link");

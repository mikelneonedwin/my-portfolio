import { z } from "zod";

export const idTokenSchema = z.string().min(1, "Token ID is required");

export const projectSchema: z.ZodSchema<Omit<Project, "id">> = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  images: z.string().url("Invalid image URL").array().optional(),
  liveUrl: z.string().url("Invalid live URL").optional(),
  githubUrl: z.string().url("Invalid GitHub URL").optional(),
  tools: z.string().min(1, "At least one tool is required").array(),
  company: z.string().optional(),
  year: z.number().int("Invalid year").positive("Invalid year"),
  media: z
    .object({
      type: z.custom<Project["media"]["type"]>((val) =>
        ["link", "image", "video"].includes(val)
      ),
      url: z.string().url(),
    }),
  featured: z.boolean().default(false).optional(),
});

export const projectIdSchema = z.string().min(1, "Project ID is required");

import { TESTING } from "@/constants";
import { generateFakeProjects } from "@/demo/project";
import { db } from "@/lib/sql";
import type { FullProject, Project } from "@/types/db";
import "server-only";

export async function getFeaturedProjects(): Promise<Project[]> {
  switch (TESTING) {
    case true:
      return generateFakeProjects({
        featured: true,
      });
    case false:
      return await db
        .selectFrom("projects")
        .where("projects.featured", "=", true)
        .selectAll()
        .execute();
  }
}

export async function getProjects(): Promise<FullProject[]> {
  switch (TESTING) {
    case true:
      return generateFakeProjects();
    case false:
      const baseProjects = await db
        .selectFrom("projects")
        .selectAll()
        .execute();
      return await Promise.all(
        baseProjects.map(async (project): Promise<FullProject> => {
          const images = await db
            .selectFrom("images")
            .where("images.project_id", "=", project.id)
            .selectAll()
            .execute();
          return {
            ...project,
            images,
          };
        })
      );
  }
}

export async function getProjectBySlug(slug: string): Promise<FullProject> {
  switch (TESTING) {
    case true:
      const results = generateFakeProjects({
        length: 1,
        slug,
      });
      return results[0];
    case false:
      const project = await db
        .selectFrom("projects")
        .where("slug", "=", slug)
        .selectAll()
        .executeTakeFirstOrThrow();
      const images = await db
        .selectFrom("images")
        .where("images.project_id", "=", project.id)
        .selectAll()
        .execute();
      return {
        ...project,
        images,
      };
  }
}

export async function getProjectSlugs(): Promise<Array<{ slug: string }>> {
  switch (TESTING) {
    case true:
      const projects = generateFakeProjects();
      return projects.map(({ slug }) => ({ slug }));
    case false:
      return await db.selectFrom("projects").select("slug").execute();
  }
}

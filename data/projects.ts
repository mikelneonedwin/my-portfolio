import { NODE_ENV } from "@/constants";
import { dbCollection } from "@/lib/firebase-admin";
import { pg } from "@/lib/pg";
import type { FullProject, Image, Project } from "@/types/db";
import "server-only";

async function fetchImagesForProject(projectId: string): Promise<Image[]> {
  switch (NODE_ENV) {
    case "development": {
      const snapshot = await dbCollection("images")
        .where("project_id", "==", projectId)
        .get();
      return snapshot.docs.map((doc) => doc.data());
    }
    case "production": {
      return await pg
        .selectFrom("images")
        .selectAll()
        .where("images.project_id", "=", projectId)
        .execute();
    }
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  switch (NODE_ENV) {
    case "development":
      const snapshot = await dbCollection("projects")
        .where("featured", "==", true)
        .get();
      return snapshot.docs.map((doc) => doc.data());
    case "production":
      return await pg
        .selectFrom("projects")
        .where("projects.featured", "=", true)
        .selectAll()
        .execute();
  }
}

export async function getProjects(): Promise<FullProject[]> {
  switch (NODE_ENV) {
    case "development":
      const projectsSnapshot = await dbCollection("projects").get();
      return await Promise.all(
        projectsSnapshot.docs.map(async (doc): Promise<FullProject> => {
          const project = doc.data();
          const images = await fetchImagesForProject(project.id);
          return {
            ...project,
            images,
          };
        })
      );
    case "production":
      const baseProjects = await pg
        .selectFrom("projects")
        .selectAll()
        .execute();
      return await Promise.all(
        baseProjects.map(async (project): Promise<FullProject> => {
          const images = await fetchImagesForProject(project.id);
          return {
            ...project,
            images,
          };
        })
      );
  }
}

export async function getProjectBySlug(slug: string): Promise<FullProject> {
  switch (NODE_ENV) {
    case "development": {
      const snapshot = await dbCollection("projects")
        .where("slug", "==", slug)
        .limit(1)
        .get();

      if (snapshot.empty) throw new Error(`Project "${slug}" does not exist`);

      const project = snapshot.docs[0].data();
      const images = await fetchImagesForProject(project.id);

      return {
        ...project,
        images,
      };
    }
    case "production": {
      const project = await pg
        .selectFrom("projects")
        .where("slug", "=", slug)
        .selectAll()
        .executeTakeFirstOrThrow();
      const images = await pg
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
}

export async function getProjectSlugs(): Promise<Array<{ slug: string }>> {
  switch (NODE_ENV) {
    case "development":
      const snapshot = await dbCollection("projects").get();
      return snapshot.docs.map((doc) => {
        const project = doc.data();
        return { slug: project.slug };
      });
    case "production":
      return await pg.selectFrom("projects").select("slug").execute();
  }
}

import { TESTING } from "@/constants";
import { adminDb } from "@/lib/firebase-admin";
import { faker } from "@faker-js/faker";
import { cache } from "react";
import "server-only";

const fakeProject = (featured: boolean = false): Project => ({
  description: faker.lorem.paragraphs(10),
  id: faker.string.nanoid(),
  slug: faker.lorem.slug(),
  title: faker.lorem.sentence(),
  featured: featured ? true : faker.datatype.boolean(),
  tools: faker.lorem.words(3).split(" "),
  year: faker.date
    .between({
      from: "2010-01-01",
      to: "2021-12-31",
    })
    .getFullYear(),
  company: faker.company.name(),
  githubUrl: faker.internet.url(),
  liveUrl: faker.internet.url(),
  media: {
    url: faker.image.urlPicsumPhotos(),
    type: "image",
  },
  images: Array.from({ length: 3 }).map(() => faker.image.urlPicsumPhotos()),
});

export const addProject = async (project: Omit<Project, "id">) => {
  const docRef = await adminDb.collection("projects").add(project);
  return docRef.id;
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  await adminDb.collection("projects").doc(id).update(project);
};

export const deleteProject = async (id: string) => {
  await adminDb.collection("projects").doc(id).delete();
};

export const getProjectBySlug = cache(async (slug: string) => {
  if (TESTING) return fakeProject();
  const snapshot = await adminDb
    .collection("projects")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  return snapshot.docs?.[0]?.data() as Project | undefined;
});

export const getFeaturedProjects = cache(async () => {
  if (TESTING) return Array.from({ length: 5 }).map(() => fakeProject(true));
  const snapshot = await adminDb
    .collection("projects")
    .where("featured", "==", true)
    .get();
  return snapshot.docs.map((doc) => doc.data()) as Project[];
});

export const getProjects = cache(async () => {
  if (TESTING) return Array.from({ length: 10 }).map(() => fakeProject());
  const snapshot = await adminDb.collection("projects").get();
  return snapshot.docs.map((doc) => doc.data() as Project);
});

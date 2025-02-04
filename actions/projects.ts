"use server";

import { adminDb } from "@/lib/firebase-admin";
import { idTokenSchema, projectIdSchema, projectSchema } from "@/schemas";
import { authorize } from "@/utils/server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createProject(
  data: z.infer<typeof projectSchema>,
  idToken: string
) {
  try {
    projectSchema.parse(data);
    await authorize(idToken);
    idTokenSchema.parse(idToken);
    await adminDb.collection("projects").add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    // TODO TRANSFORM ERROR
    // eslint-disable-next-line no-console
    console.error("Error creating project:", error);
    return "Failed to create project";
  }
  revalidatePath("/projects/");
  revalidatePath(`/projects/${data.slug}`);
}

export async function updateProject(
  id: string,
  idToken: string,
  data: z.infer<typeof projectSchema>
) {
  try {
    projectSchema.parse(data);
    idTokenSchema.parse(idToken);
    projectIdSchema.parse(id);
    await authorize(idToken);
    // TODO update images that are data urls
    await adminDb
      .collection("projects")
      .doc(id)
      .update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    // TODO TRANSFORM ERROR
    // eslint-disable-next-line no-console
    console.error("Error updating project:", error);
    return "Failed to update project";
  }
  revalidatePath("/projects");
  revalidatePath(`/projects/${data.slug}`);
}

export async function deleteProject(id: string, idToken: string) {
  try {
    projectIdSchema.parse(id);
    idTokenSchema.parse(idToken);
    await authorize(idToken);
    await adminDb.collection("projects").doc(id).delete();
    return { error: false, message: "Project deleted successfully" };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting project:", error);
    return { error: true, message: "Failed to delete project" };
  }
}

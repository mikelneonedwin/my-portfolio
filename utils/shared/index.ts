import { SITE } from "@/constants";
import { FirebaseError } from "firebase/app";
import { FirestoreError } from "firebase/firestore";
import { StorageError } from "firebase/storage";
import { z } from "zod";

const formatZodError = (error: z.ZodError): string => {
  const messages = error.errors.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });

  return `Validation failed: ${messages.join(", ")}`;
};

export function errorMessage(error: unknown): string {
  if (error instanceof z.ZodError) return formatZodError(error);
  if (error instanceof FirebaseError) {
  }
  if (error instanceof FirestoreError) {
  }
  if (error instanceof StorageError) {
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export function getSite() {
  if (!SITE) return undefined;
  return `https://${SITE.replace("https://", "")}`;
}

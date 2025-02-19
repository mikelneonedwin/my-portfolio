import { SITE } from "@/constants";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === "string") {
    return `Error: ${error}`;
  }

  if (typeof error === "object" && error !== null) {
    try {
      return `Error: ${JSON.stringify(error, null, 2)}`;
    } catch {
      return "Error: [Unserializable Object]";
    }
  }

  return `Error: ${String(error).replaceAll("Error: ", "")}`;
}

export function getSite() {
  if (!SITE) return undefined;
  return `https://${SITE.replace("https://", "")}`;
}

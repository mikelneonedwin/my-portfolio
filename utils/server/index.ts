import { getAllowedEmails } from "@/data/admin";
import { adminAuth } from "@/lib/firebase-admin";
import { unauthorized } from "next/navigation";

export async function authorize(idToken: string) {
  const { email } = await adminAuth.verifyIdToken(idToken);
  const allowedEmails = await getAllowedEmails();
  if (email && allowedEmails.includes(email)) return;
  unauthorized();
}

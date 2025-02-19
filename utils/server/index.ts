import { getLoginEmails } from "@/data";
import { adminAuth } from "@/lib/firebase-admin";

export async function isAdminEmail(email?: string | null) {
  const allowedEmails = await getLoginEmails();
  return email && allowedEmails.includes(email);
}

export async function authorize(idToken: string) {
  const { email } = await adminAuth.verifyIdToken(idToken);
  const isAllowed = await isAdminEmail(email);
  if (!isAllowed) throw new Error("Unauthorized!");
}

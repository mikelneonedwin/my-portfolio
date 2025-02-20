import { adminAuth } from "@/lib/firebase-admin";
import { kv } from "@/lib/kv";

export async function authorize(idToken: string) {
  const { email } = await adminAuth.verifyIdToken(idToken);
  const myEmail = await kv.get("email");
  if (myEmail !== email) throw new Error("Unauthorized!");
}

import { SESSION_COOKIE } from "@/constants";
import { adminAuth } from "@/lib/firebase-admin";
import { idTokenSchema } from "@/schemas";
import { cookies } from "next/headers";
import "server-only";

/**
 * Verify user's id token and check the current session for validity
 * @param idToken
 */
export async function authorize(idToken: string) {
  idTokenSchema.parse(idToken);

  const cookie = await cookies();
  const sessionCookie = cookie.get(SESSION_COOKIE);

  if (!sessionCookie) throw new Error("Unauthorized!");

  const [tokenResult, cookieResult] = await Promise.all([
    await adminAuth.verifyIdToken(idToken),
    await adminAuth.verifySessionCookie(sessionCookie.value),
  ]);

  if (
    !tokenResult.email ||
    !cookieResult.email ||
    tokenResult.email !== cookieResult.email
  )
    throw new Error("Unauthorized!");
}

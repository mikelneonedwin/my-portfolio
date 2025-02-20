"use server";

import { HAS_SESSION_COOKIE, SESSION_COOKIE } from "@/constants";
import { adminAuth } from "@/lib/firebase-admin";
import { kv } from "@/lib/kv";
import { idTokenSchema } from "@/schemas";
import { getErrorMessage } from "@/utils/shared";
import { waitUntil } from "@vercel/functions";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

export async function createSession(idToken: string): Promise<string | null> {
  const cookie = await cookies();
  try {
    idTokenSchema.parse(idToken);
    const expiresIn = 60 * 60;
    const { email, uid } = await adminAuth.verifyIdToken(idToken);
    const myEmail = await kv.get("email");
    if (myEmail !== email) {
      waitUntil(adminAuth.deleteUser(uid));
      throw new Error("Unauthorized!]");
    }
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: expiresIn * 1000,
    });
    cookie.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
    cookie.set({
      name: HAS_SESSION_COOKIE,
      value: randomUUID(),
      maxAge: expiresIn,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error creating session:", err);
    return getErrorMessage(err);
  }
}

export async function deleteSession() {
  const cookie = await cookies();
  cookie.delete(SESSION_COOKIE);
}

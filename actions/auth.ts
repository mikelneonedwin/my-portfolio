"use server";

import { HAS_SESSION_COOKIE, SESSION_COOKIE, SITE } from "@/constants";
import { adminAuth } from "@/lib/firebase-admin";
import { authorize } from "@/utils/server";
import { serverErrorMessage } from "@/utils/server/errors";
import { errorMessage } from "@/utils/shared";
import { cookies, headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function createSession(idToken: string): Promise<string | null> {
  try {
    await authorize(idToken);
    // allow session for an hour
    const expiresIn = 60 * 60;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: expiresIn * 1000,
    });
    const cookie = await cookies();
    cookie.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
    // TODO CHECK IF IT IS POSSIBLE TO CHECK WHEN COOKIES WILL EXPIRE ON THE CLIENT
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
    return errorMessage(err);
  }
}

export async function deleteSession() {
  const cookie = await cookies();
  cookie.delete(SESSION_COOKIE);
  cookie.delete(HAS_SESSION_COOKIE);
}

export async function sendMagicLinkToAdmin() {
  try {
    const header = await headers();
    // TODO Zod error is no email exists in the kv
    // const kvEmail = await kv.get("email");
    const kvEmail = "test@email.com";
    const email = await z
      .string({
        invalid_type_error: "No email address in configuration",
      })
      .email("Invalid email address stored in configuration")
      .parseAsync(kvEmail);
    // TODO check headers for url
    const url = `${header.get("origin") || SITE}/auth/callback`;
    const signInUrl = await adminAuth.generateSignInWithEmailLink(email, {
      url,
      handleCodeInApp: true,
    });
    // eslint-disable-next-line no-console
    console.log(signInUrl);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error sending magic link:", error);
    return serverErrorMessage(error);
  }
}

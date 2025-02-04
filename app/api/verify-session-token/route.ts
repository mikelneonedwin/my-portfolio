import { SESSION_COOKIE } from "@/constants";
import { adminAuth } from "@/lib/firebase-admin";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const UNAUTHORIZED = new Response("Unauthorized", { status: 401 });
const OK = new Response("OK", { status: 200 });

export async function POST(req: NextRequest) {
  const sessionCookie = req.headers.get(SESSION_COOKIE);
  if (!sessionCookie) return UNAUTHORIZED;
  return adminAuth
    .verifySessionCookie(sessionCookie)
    .then(() => OK)
    .catch(() => UNAUTHORIZED);
}

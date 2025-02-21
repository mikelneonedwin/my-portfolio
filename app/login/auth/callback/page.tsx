// TODO STYLE IT BETTER


"use client";

import { auth } from "@/lib/firebase";
import { signInWithEmailLink } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email =
    searchParams.get("email") || localStorage.getItem("emailForSignIn");

  useEffect(() => {
    if (!email) {
      router.replace("/login");
      return;
    }

    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        localStorage.removeItem("emailForSignIn");
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/login?error=invalid_link");
      });
  }, [email, router]);

  return <p>Authenticating...</p>;
}

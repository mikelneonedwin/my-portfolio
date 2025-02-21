"use client";

import { createSession } from "@/actions/auth";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { runAction } from "@/utils/client";
import { errorMessage } from "@/utils/shared";
import { signInWithEmailLink } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

enum State {
  Loading,
  Error,
  Success,
}

export default function AuthCallback() {
  const [state, setState] = useState(State.Loading);
  const [errorText, setErrorText] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    try {
      if (!signInWithEmailLink(auth, window.location.href))
        throw new Error("Invalid sign-in link. Please request a new one.");
      const url = new URL(window.location.href);
      const email = url.searchParams.get("email")!;
      await z.string().email().parseAsync(email);
      const { user } = await signInWithEmailLink(
        auth,
        email,
        window.location.href
      );
      const idToken = await user.getIdToken();
      await runAction(createSession(idToken));
      setState(State.Success);
    } catch (error) {
      const errMsg = errorMessage(error);
      setErrorText(errMsg);
      setState(State.Error);
      toast({
        title: "Authentication Error",
        description: errMsg,
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    void signIn();
  }, [signIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px] text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {state === State.Error
              ? "Authentication Failed"
              : "Authenticating..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {state === State.Loading && <Spinner />}
          {state === State.Error && (
            <>
              <p className="mt-4 text-sm text-destructive">
                {errorText || "An error occurred during authentication."}
              </p>
              <Button
                onClick={() => {
                  setState(State.Loading);
                  void signIn();
                }}
              >
                Retry
              </Button>
            </>
          )}
          {state === State.Success && (
            <p className="mt-4 text-sm text-green-600">
              Successfully authenticated! Redirecting...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

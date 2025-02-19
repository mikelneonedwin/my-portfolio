"use client";

import Spinner from "@/components/spinner";
import { Google } from "@/components/svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/utils/shared";
import { Github } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleSignIn = (...args: Parameters<typeof signIn>) => {
    setLoading(true);
    setActiveProvider(...args);
    signIn(...args).catch((error) => {
      toast({
        title: "Uh oh! Something went wrong.",
        variant: "destructive",
        description: getErrorMessage(error),
      });
      setLoading(false);
      setActiveProvider(null);
    });
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Ready?</CardTitle>
          <CardDescription>Let&apos;s get you logged in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => handleSignIn("google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading && activeProvider === "google" ? (
                <Spinner />
              ) : (
                <>
                  <Google />
                  Sign in with Google
                </>
              )}
            </Button>
            <Button
              onClick={() => handleSignIn("github")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading && activeProvider === "github" ? (
                <Spinner />
              ) : (
                <>
                  <Github size={20} />
                  Sign in with GitHub
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Login</h1>
        {error && <p className="text-red-500 mb-6">{error}</p>}
        <div className="space-y-4">
          <Button
            onClick={() => handleSignIn("google")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            {loading && activeProvider === "google" ? (
              <Spinner />
            ) : (
              <>
                <Google />
                Sign in with Google
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSignIn("github")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            {loading && activeProvider === "github" ? (
              <Spinner />
            ) : (
              <>
                <Github size={20} />
                Sign in with GitHub
              </>
            )}
          </Button>
        </div>
      </div> */}
    </main>
  );
}

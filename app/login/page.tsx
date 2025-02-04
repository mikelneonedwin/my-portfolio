"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Github } from "lucide-react";
import { useState } from "react";
import { SocialIcon } from "react-social-icons";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleSignIn = (...args: Parameters<typeof signIn>) => {
    setLoading(true);
    setActiveProvider(...args);
    setError("");
    signIn(...args).catch(() => {
      setError(`Failed to log in with ${args.join("")}. Please try again.`);
      setLoading(false);
      setActiveProvider(null);
    });
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
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
                <SocialIcon url="www.google.com" className="size-5" />
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
      </div>
    </main>
  );
}

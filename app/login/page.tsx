"use client";

import { sendMagicLinkToAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { runAction } from "@/utils/client";
import { errorMessage } from "@/utils/shared";
import { useState } from "react";

enum State {
  None,
  Sending,
  Sent,
}

export default function LoginPage() {
  const [state, setState] = useState(State.None);
  const { toast } = useToast();

  const handleSendLink = async () => {
    setState(State.Sending);
    try {
      await runAction(sendMagicLinkToAdmin());
      toast({
        title: "Magic Link Sent ✨",
        description: "Check your email to unlock your portal 🚀",
      });
      setState(State.Sent);
    } catch (error) {
      toast({
        title: "Oh no! Something went wrong",
        description: errorMessage(error),
        variant: "destructive",
      });
      setState(State.None);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center min-h-screen">
      <Card className="w-[350px] shadow-2xl rounded-xl bg-white/90">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-extrabold">
            Welcome Back! 👋
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">Get your instant login link ✨</p>
          <Button
            type="button"
            onClick={handleSendLink}
            disabled={state === State.Sending}
          >
            {state === State.None && "Send Link ✨"}
            {state === State.Sending && "Sending..."}
            {state === State.Sent && "Sent! 🔥"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

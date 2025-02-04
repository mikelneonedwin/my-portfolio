import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        Oops! Looks like this page took a vacation. 🏖️
      </p>
      <Link prefetch href="/" className="text-primary hover:underline">
        <Button type="button">Go back to the homepage</Button>
      </Link>
    </main>
  );
}

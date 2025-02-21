import { kv } from "@/lib/kv";
import { Mail } from "lucide-react";
import Link from "next/link";

export async function Footer() {
  // const remotes = await git.getRemotes(true);
  // const origin = remotes.find((remote) => remote.name === "origin");
  const [name, email] = await kv.getAll("name", "email");
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            {name && `Built by ${name}.`}{" "}
            {/* {origin && (
              <>
                The source code is available on{" "}
                <Link
                  href={origin.refs.fetch}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  GitHub
                </Link>
                .
              </>
            )} */}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* {origin && (
            <Link
              href={origin.refs.fetch.split("/").slice(0, -1).join("/")}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={20} />
            </Link>
          )} */}
          {email && (
            <Link href={`mailto:${email}`} target="_blank" rel="noreferrer">
              <Mail size={20} />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

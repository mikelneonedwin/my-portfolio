import { getAdminData } from "@/data/admin";
import git from "@/lib/git";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export async function Footer() {
  const { email, name, socials } = await getAdminData();
  const remotes = await git.getRemotes(true);
  const origin = remotes.find((remote) => remote.name === "origin");
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by {name}.{" "}
            {origin && (
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
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {origin && (
            <Link
              href={origin.refs.fetch.split("/").slice(0, -1).join("/")}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={20} />
            </Link>
          )}
          {socials.LinkedIn && (
            <Link href={socials.LinkedIn} target="_blank" rel="noreferrer">
              <Linkedin size={20} />
            </Link>
          )}
          <Link href={`mailto:${email}`} target="_blank" rel="noreferrer">
            <Mail size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}

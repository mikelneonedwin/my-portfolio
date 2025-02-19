"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/auth";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";

type HeaderLink = {
  href: string;
  label: string;
  regex?: RegExp;
};

const headerLinks: HeaderLink[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects", regex: /^\/projects/ },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

export function Header({ name }: { name: string | null }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          {name && (
            <Link
              href="/"
              className="mr-6 flex items-center space-x-2"
              prefetch
            >
              <span className="hidden font-bold sm:inline-block">{name}</span>
            </Link>
          )}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {headerLinks.map(({ href, label, regex }) => (
              <Link
                key={href}
                href={href}
                prefetch
                className={
                  regex?.test(pathname) || pathname === href
                    ? "text-foreground"
                    : "text-foreground/60"
                }
              >
                {label}
              </Link>
            ))}
            {user && (
              <Link
                href="/new"
                prefetch
                className={
                  pathname === "/new" ? "text-foreground" : "text-foreground/60"
                }
              >
                New Project
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {user && (
            <nav className="flex items-center">
              <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </nav>
          )}
          <ModeToggle />
          <div className="md:hidden">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button variant="ghost">Menu</Button>
                </MenubarTrigger>
                <MenubarContent>
                  {headerLinks.map(({ href, label, regex }) => (
                    <MenubarItem key={href}>
                      <Link
                        href={href}
                        prefetch
                        className={
                          regex?.test(pathname) || pathname === href
                            ? "text-foreground"
                            : "text-foreground/60"
                        }
                      >
                        {label}
                      </Link>
                    </MenubarItem>
                  ))}
                  {user && (
                    <MenubarItem>
                      <Link
                        href="/new"
                        prefetch
                        className={
                          pathname === "/new"
                            ? "text-foreground"
                            : "text-foreground/60"
                        }
                      >
                        New Project
                      </Link>
                    </MenubarItem>
                  )}
                  {user && (
                    <MenubarItem>
                      <Button variant="ghost" onClick={() => signOut()}>
                        <LogOut /> Sign Out
                      </Button>
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </header>
  );
}

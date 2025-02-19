"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import ProjectMedia from "./ProjectMedia";

export function ProjectCard({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const handleOpening = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open) {
        window.history.pushState(null, "", `/projects/${project.slug}`);
      } else {
        window.history.back();
      }
    },
    [setIsOpen, project.slug]
  );
  return (
    <Dialog open={isOpen} onOpenChange={handleOpening}>
      <DialogTrigger asChild>
        <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105">
          <ProjectMedia
            width={400}
            height={200}
            alt={project.title}
            media={project.media}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-sm mb-2">
              {project.description.slice(0, 100)}...
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[100%] overflow-y-auto custom-scrollbar">
        <div className="grid gap-4">
          <DialogHeader>
            <div className="relative aspect-video">
              <ProjectMedia
                width={700}
                height={394}
                alt={project.title}
                media={project.media}
                className="rounded-t-lg object-cover"
                image={
                  <Image
                    src={project.media.url}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                }
              />
            </div>
            <DialogTitle>
              <span className="text-2xl font-semibold">{project.title}</span>
            </DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>
          <div>
            <h3 className="font-semibold mb-2">Tools Used:</h3>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {project.liveUrl && (
              <Button asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Preview
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repo
                </a>
              </Button>
            )}
            {user && (
              <Button asChild variant="outline">
                <Link prefetch href={`/projects/${project.slug}/edit`}>
                  Edit
                </Link>
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

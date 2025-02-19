"use client";

import { Button } from "@/components/ui/button";
import type { FullProject } from "@/types/db";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/auth";
import ProjectMedia from "./ProjectMedia";

export function ProjectDetails({ project }: { project: FullProject }) {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <ProjectMedia
          alt={project.title}
          width={800}
          height={400}
          className="rounded-lg shadow-lg"
          media={project.media}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {user && (
          <Button asChild variant="outline">
            <Link prefetch href={`/projects/${project.slug}/edit`}>
              Edit Project
            </Link>
          </Button>
        )}
      </div>
      <p className="text-lg mb-6">{project.description}</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tools Used:</h2>
        <div className="flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-4 mb-8">
        {project.live_url && (
          <Button asChild>
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Preview
            </a>
          </Button>
        )}
        {project.github_url && (
          <Button asChild variant="outline">
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repo
            </a>
          </Button>
        )}
      </div>
      {project.images && project.images.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">More Images:</h2>
          <div className="grid grid-cols-2 gap-4">
            {project.images.map((image, index) => (
              <Image
                width={400}
                key={index}
                src={image.url}
                height={300}
                className="rounded-lg shadow-md"
                alt={`${project.title} - Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

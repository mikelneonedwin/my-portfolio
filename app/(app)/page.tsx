import { Button } from "@/components/ui/button";
import { getSkills } from "@/data";
import { getFeaturedProjects } from "@/data/projects";
import { kv } from "@/lib/redis";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { prefix, name, suffix, image, bio } = await kv.getAll(
    "prefix",
    "suffix",
    "name",
    "image",
    "bio"
  );
  const title = clsx(prefix, name, suffix);
  const skills = await getSkills();
  const featuredProjects = await getFeaturedProjects();
  return (
    <>
      <section className="text-center mb-16">
        {/* TODO CAROUSEL */}
        {image && (
          <Image
            width={200}
            height={200}
            src={image}
            alt={name ?? "Me"}
            className="rounded-full mx-auto mb-4"
          />
        )}
        {name && <h1 className="text-4xl font-bold mb-4">{name}</h1>}
        {title && <p className="text-xl mb-8">{title}</p>}
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link prefetch href="/projects">
              View Projects
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link prefetch href="/contact">
              Contact Me
            </Link>
          </Button>
        </div>
      </section>

      {bio && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <p className="mb-4">{bio}</p>
        </section>
      )}

      {skills.length > 1 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Skills & Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-card text-card-foreground p-4 rounded-lg flex items-center space-x-2"
              >
                {skill.icon_url && (
                  <Image
                    src={skill.icon_url}
                    alt={skill.name}
                    width={24}
                    height={24}
                  />
                )}
                <span>{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {featuredProjects.length > 1 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-md"
              >
                <Image
                  src={project.media.url}
                  alt={project.title}
                  width={400}
                  height={200}
                  className="rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="mb-4">{project.description}</p>
                <Button asChild>
                  <Link href={`/projects/${project.id}`}>View Project</Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link prefetch href="/projects">
                View All Projects
              </Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}

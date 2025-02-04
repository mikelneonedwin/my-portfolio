import { Button } from "@/components/ui/button";
import { getAdminData } from "@/data/admin";
import { getFeaturedProjects } from "@/data/projects";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const admin = await getAdminData();
  const featuredProjects = await getFeaturedProjects();
  return (
    <>
      <section className="text-center mb-16">
        {/* TODO CAROUSEL */}
        <Image
          width={200}
          height={200}
          src={admin.images[0]}
          alt={admin.name}
          className="rounded-full mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">{admin.name}</h1>
        {admin.title && <p className="text-xl mb-8">{admin.title}</p>}
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

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="mb-4">{admin.bio}</p>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Skills & Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {admin.skills.map((skill) => (
            <div
              key={skill.name}
              className="bg-card text-card-foreground p-4 rounded-lg flex items-center space-x-2"
            >
              <Image src={skill.icon} alt={skill.name} width={24} height={24} />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </section>

      {!!featuredProjects.length && (
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

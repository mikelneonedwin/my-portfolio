import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/data/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}

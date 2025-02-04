import { ProjectForm } from "@/components/ProjectForm";
import { getProjectBySlug, getProjects } from "@/data/projects";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function EditProjectPage({ params }: Props) {
  const props = await params;
  const project = await getProjectBySlug(props.slug);
  if (!project) notFound();
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Edit Project: {project.title}</h1>
      <ProjectForm project={project} />
    </>
  );
}

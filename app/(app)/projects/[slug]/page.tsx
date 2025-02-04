import { ProjectDetails } from "@/components/ProjectDetails";
import { getProjectBySlug } from "@/data/projects";
import { notFound } from "next/navigation";

type props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetails project={project} />;
}

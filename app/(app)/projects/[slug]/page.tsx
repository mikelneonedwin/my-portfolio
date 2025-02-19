import { ProjectDetails } from "@/components/ProjectDetails";
import { getProjectBySlug } from "@/data/projects";

type props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return <ProjectDetails project={project} />;
}

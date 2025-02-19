import { ProjectForm } from "@/components/ProjectForm";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return await getProjectSlugs();
}

export default async function EditProjectPage({ params }: Props) {
  const props = await params;
  const project = await getProjectBySlug(props.slug);
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Edit Project: {project.title}</h1>
      <ProjectForm project={project} />
    </>
  );
}

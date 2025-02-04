import { ProjectForm } from "@/components/ProjectForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Project - My Portfolio",
  description:
    "Add a new project to your portfolio. Fill out the form to showcase your latest work.",
  keywords: ["portfolio", "project", "add project", "new project"],
};

export default function NewProjectPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Add New Project</h1>
      <ProjectForm />
    </>
  );
}

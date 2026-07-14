import { ReactNode } from "react";
import { getProjectDetails } from "@/app/actions/queries";
import { notFound } from "next/navigation";
import { ProjectNav } from "./project-nav";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectDetails(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b border-border bg-card/50">
        <div className="p-8 max-w-[1600px] mx-auto pb-0">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{project.name}</h1>
          <p className="text-muted-foreground mb-6">{project.description}</p>
          
          <ProjectNav projectId={project.id} />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted/10">
        {children}
      </div>
    </div>
  );
}

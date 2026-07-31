import { auth } from "@clerk/nextjs/server";
import { getProjectDetails, getProjectMembers, getProjectInvitations } from "@/app/actions/queries";
import ProjectMembersClient from "@/components/dashboard/projects/ProjectMembersClient";
import Link from "next/link";
import { FolderX, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProjectMembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 pt-16">
        <FolderX className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold">Invalid Project URL</h2>
        <p className="text-sm text-muted-foreground">The project ID specified in the URL is missing or invalid.</p>
        <Link href="/dashboard/projects"><Button>Back to Projects</Button></Link>
      </div>
    );
  }

  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 pt-16">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold">Authentication Required</h2>
        <p className="text-sm text-muted-foreground">Please sign in to access project member management.</p>
        <Link href="/sign-in"><Button>Sign In</Button></Link>
      </div>
    );
  }

  const project = await getProjectDetails(id);
  if (!project) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 pt-16">
        <FolderX className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested project could not be found or has been removed.</p>
        <Link href="/dashboard/projects">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const userMember = project.members?.find((m: any) => m.userId === userId);
  const isOrgMember = project.organization?.members?.find((m: any) => m.userId === userId);

  const currentUserRole = userMember?.role || (isOrgMember ? "ADMIN" : "OWNER");
  const members = await getProjectMembers(id);
  const pendingInvites = await getProjectInvitations(id);

  return (
    <ProjectMembersClient
      projectId={project.id}
      projectName={project.name}
      initialMembers={members}
      initialPendingInvites={pendingInvites}
      currentUserRole={currentUserRole}
    />
  );
}

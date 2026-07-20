import { getProjectMembers } from "@/app/actions/queries";
import { User, ShieldAlert, Shield } from "lucide-react";
import InviteMemberButton from "@/components/dashboard/projects/InviteMemberButton";

export default async function ProjectMembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const members = await getProjectMembers(id);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Members</h2>
          <p className="text-muted-foreground mt-1">Manage who has access to this project.</p>
        </div>
        <InviteMemberButton projectId={id} />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] p-4 bg-muted/30 border-b border-border/50 text-sm font-semibold text-muted-foreground">
          <div>User</div>
          <div>Email / ID</div>
          <div>Role</div>
          <div>Joined</div>
        </div>
        <div className="divide-y divide-border/50">
          {members.map((member: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <div key={member.id} className="grid grid-cols-[1fr_2fr_1fr_1fr] p-4 items-center hover:bg-muted/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                  {member.user?.profile?.firstName?.[0] || <User className="h-4 w-4" />}
                </div>
                <span className="font-medium">
                  {member.user?.profile?.firstName ? `${member.user.profile.firstName} ${member.user.profile.lastName}` : 'Unknown User'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate pr-4">
                {member.user?.email || member.userId}
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1.5 w-fit ${
                  member.role === 'OWNER' ? 'bg-primary/10 text-primary' :
                  member.role === 'ADMIN' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-secondary text-secondary-foreground'
                }`}>
                  {member.role === 'OWNER' && <ShieldAlert className="h-3 w-3" />}
                  {member.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                  {member.role}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

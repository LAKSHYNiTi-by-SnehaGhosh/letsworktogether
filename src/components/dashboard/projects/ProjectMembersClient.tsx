"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  ShieldAlert,
  Users,
  Clock,
  Plus,
  Loader2,
  Mail,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  inviteMemberToProject,
  updateProjectMemberRole,
  removeProjectMember,
  cancelProjectInvitation,
  resendProjectInvitation,
} from "@/app/actions/projects";
import { toast } from "sonner";

interface ProjectMembersClientProps {
  projectId: string;
  projectName: string;
  initialMembers: any[];
  initialPendingInvites: any[];
  currentUserRole: string;
}

export default function ProjectMembersClient({
  projectId,
  projectName,
  initialMembers,
  initialPendingInvites,
  currentUserRole,
}: ProjectMembersClientProps) {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>(initialMembers);
  const [pendingInvites, setPendingInvites] = useState<any[]>(initialPendingInvites);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [customMessage, setCustomMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inviteMemberToProject(projectId, cleanEmail, role, customMessage);
      if (res.success) {
        toast.success(res.message || "Invitation email sent successfully!");
        setEmail("");
        setCustomMessage("");
        setIsInviteModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to send invitation.");
        if (res.inviteLink) {
          await navigator.clipboard.writeText(res.inviteLink);
          toast.info("Invite link copied to clipboard so you can share it manually!");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyInviteLink = async () => {
    setIsCopying(true);
    try {
      const targetEmail = email.trim() || `invite-${Math.random().toString(36).substring(2, 7)}@guest.letsworktogether.lakshyniti.com`;
      const res = await inviteMemberToProject(projectId, targetEmail, role, customMessage);
      if (res.inviteLink) {
        await navigator.clipboard.writeText(res.inviteLink);
        toast.success("Project invite link copied to clipboard!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to generate invite link.");
      }
    } catch (err) {
      toast.error("Failed to copy link.");
    } finally {
      setIsCopying(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: string) => {
    setActionLoadingId(targetUserId);
    try {
      const res = await updateProjectMemberRole(projectId, targetUserId, newRole);
      if (res.success) {
        toast.success("Member role updated.");
        setMembers((prev) =>
          prev.map((m) => (m.userId === targetUserId ? { ...m, role: newRole } : m))
        );
      } else {
        toast.error(res.error || "Failed to update role.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!confirm("Are you sure you want to remove this member from the project?")) return;
    setActionLoadingId(targetUserId);
    try {
      const res = await removeProjectMember(projectId, targetUserId);
      if (res.success) {
        toast.success("Member removed from project.");
        setMembers((prev) => prev.filter((m) => m.userId !== targetUserId));
      } else {
        toast.error(res.error || "Failed to remove member.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    setActionLoadingId(invitationId);
    try {
      const res = await cancelProjectInvitation(invitationId);
      if (res.success) {
        toast.success("Invitation cancelled.");
        setPendingInvites((prev) => prev.filter((inv) => inv.id !== invitationId));
      } else {
        toast.error(res.error || "Failed to cancel invitation.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResendInvite = async (invitationId: string) => {
    setActionLoadingId(invitationId);
    try {
      const res = await resendProjectInvitation(invitationId);
      if (res.success) {
        toast.success(res.message || "Invitation resent!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to resend invitation.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyLink = async (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedToken(token);
      toast.success("Invitation link copied!");
      setTimeout(() => setCopiedToken(null), 3000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Project Members <span className="text-sm font-normal text-muted-foreground">({projectName})</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage active team collaborators, roles, and project invitations.
          </p>
        </div>

        {canManage && (
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[image:var(--brand-gradient)] border-0 text-white shadow-md hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" /> Invite Member
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] bg-card/95 backdrop-blur-xl border-border/70 shadow-2xl">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5 text-lwt-blue" />
                  <DialogTitle className="text-xl font-bold">Invite to Project</DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-sm">
                  Send an email invitation or generate a shareable token link to join <strong className="text-foreground">{projectName}</strong>.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border/80 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all placeholder:text-muted-foreground/60"
                    placeholder="teammate@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" /> Assigned Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border/80 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  >
                    <option value="MEMBER">Member - Can complete tasks and collaborate</option>
                    <option value="ADMIN">Admin - Full project settings access</option>
                    <option value="VIEWER">Viewer - Read-only access</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" /> Optional Note
                  </label>
                  <textarea
                    rows={2}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-border/80 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all placeholder:text-muted-foreground/60 resize-none"
                    placeholder="Hey! Join our sprint board on LWT..."
                  />
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[image:var(--brand-gradient)] border-0 text-white font-medium shadow-md hover:opacity-90 transition-opacity gap-2 py-5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending Invitation...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" /> Send Email Invitation
                      </>
                    )}
                  </Button>

                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-medium">or share link</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyInviteLink}
                    disabled={isCopying}
                    className="w-full gap-2 border-border/80 bg-secondary/30 hover:bg-secondary/60 transition-colors py-5 font-medium text-sm"
                  >
                    {isCopying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LinkIcon className="h-4 w-4 text-primary" />
                    )}
                    Copy Shareable Invite Link
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Active Members Table */}
      <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-secondary/30 border-b border-border/60 flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" /> Active Project Members ({members.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-3.5">Member</th>
                <th className="px-6 py-3.5">Email / Identifier</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Joined Date</th>
                {canManage && <th className="px-6 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {members.map((member) => {
                const userProfile = member.user?.profile;
                const displayName = userProfile?.firstName
                  ? `${userProfile.firstName} ${userProfile.lastName || ""}`.trim()
                  : "Collaborator";
                const userEmail = member.user?.email || member.userId;

                return (
                  <tr key={member.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {userProfile?.firstName?.[0] || <User className="h-4 w-4" />}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground block">{displayName}</span>
                          <span className="text-xs text-emerald-500 font-medium">Active Member</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs truncate max-w-[200px]">
                      {userEmail}
                    </td>
                    <td className="px-6 py-4">
                      {canManage && member.role !== "OWNER" ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                          disabled={actionLoadingId === member.userId}
                          className="bg-secondary/50 border border-border/80 rounded-md px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MEMBER">MEMBER</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      ) : (
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1.5 ${
                            member.role === "OWNER"
                              ? "bg-primary/15 text-primary border border-primary/20"
                              : member.role === "ADMIN"
                              ? "bg-amber-500/15 text-amber-500 border border-amber-500/20"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {member.role === "OWNER" && <ShieldAlert className="h-3 w-3" />}
                          {member.role === "ADMIN" && <Shield className="h-3 w-3" />}
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(member.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        {member.role !== "OWNER" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.userId)}
                            disabled={actionLoadingId === member.userId}
                            className="h-8 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            title="Remove Member"
                          >
                            {actionLoadingId === member.userId ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Project Invitations Table */}
      {pendingInvites.length > 0 && (
        <div className="bg-card border border-border/60 rounded-xl shadow-sm overflow-hidden space-y-0">
          <div className="p-4 bg-secondary/30 border-b border-border/60 flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-amber-500" /> Pending Project Invitations ({pendingInvites.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-3.5">Invited Email</th>
                  <th className="px-6 py-3.5">Assigned Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Sent Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <AnimatePresence mode="popLayout">
                  {pendingInvites.map((invite) => (
                    <motion.tr
                      key={invite.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{invite.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {invite.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock className="h-3 w-3" /> Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(invite.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLink(invite.token)}
                            className="h-8 px-2 text-xs gap-1"
                            title="Copy Invitation Link"
                          >
                            {copiedToken === invite.token ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <LinkIcon className="h-3.5 w-3.5 text-primary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResendInvite(invite.id)}
                            disabled={actionLoadingId === invite.id}
                            className="h-8 px-2 text-xs gap-1"
                            title="Resend Invitation Email"
                          >
                            {actionLoadingId === invite.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3.5 w-3.5 text-primary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvite(invite.id)}
                            disabled={actionLoadingId === invite.id}
                            className="h-8 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            title="Cancel Invitation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

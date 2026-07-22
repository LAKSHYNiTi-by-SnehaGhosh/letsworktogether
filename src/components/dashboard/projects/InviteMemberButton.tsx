"use client";

import { useState } from "react";
import { Plus, Loader2, Link as LinkIcon, CheckCircle2, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inviteMemberToProject } from "@/app/actions/projects";
import { toast } from "sonner";

export default function InviteMemberButton({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [isInviting, setIsInviting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setIsInviting(true);
    const result = await inviteMemberToProject(projectId, identifier, role);
    setIsInviting(false);

    if (result.success) {
      toast.success(result.message || "Invitation email sent successfully!");
      setIsOpen(false);
      setIdentifier("");
    } else {
      toast.error(result.error || "Failed to send invitation.");
    }
  };

  const handleCopyLink = async () => {
    setIsCopying(true);
    try {
      const targetEmail = identifier.trim() || `guest-${Math.random().toString(36).substring(2, 7)}@invite.lwt.com`;
      const result = await inviteMemberToProject(projectId, targetEmail, role);
      if (result.inviteLink) {
        await navigator.clipboard.writeText(result.inviteLink);
        setCopied(true);
        toast.success("Invite link copied to clipboard!");
        setTimeout(() => setCopied(false), 3000);
      } else {
        toast.error(result.error || "Failed to generate invite link.");
      }
    } catch (err) {
      toast.error("Failed to copy link.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[image:var(--brand-gradient)] flex items-center gap-2 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" /> Invite Member
      </button>
      <DialogContent className="sm:max-w-[440px] bg-card border-border/80 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Invite to Project</DialogTitle>
          <DialogDescription>
            Invite a user using their email address, or copy a secure invitation link to share.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
            </label>
            <input 
              required
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2.5 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="e.g. user@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" /> Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button type="submit" disabled={isInviting} className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm w-full py-5 font-medium">
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Email Invitation"}
            </Button>
            
            <Button type="button" variant="outline" onClick={handleCopyLink} disabled={isCopying} className="w-full gap-2 font-medium py-5">
              {isCopying ? <Loader2 className="h-4 w-4 animate-spin" /> : copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <LinkIcon className="h-4 w-4 text-primary" />}
              {copied ? "Link Copied!" : "Copy Unique Invite Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

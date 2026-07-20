"use client";

import { useState } from "react";
import { Plus, Loader2, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inviteMemberToProject } from "@/app/actions/projects";

export default function InviteMemberButton({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setIsInviting(true);
    const result = await inviteMemberToProject(projectId, identifier);
    setIsInviting(false);

    if (result.success) {
      alert(result.message || "Member invited successfully!");
      setIsOpen(false);
      setIdentifier("");
      window.location.reload(); // Refresh to see the new member
    } else {
      alert(result.error || "Failed to invite member.");
    }
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/dashboard/projects?joinId=${projectId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[image:var(--brand-gradient)] flex items-center gap-2 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" /> Invite Member
      </button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite a Member</DialogTitle>
          <DialogDescription>
            Invite a user to this project using their email address, or share the project link with them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address or Username</label>
            <input 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. user@example.com"
            />
            <p className="text-xs text-muted-foreground">The user must have already signed up to be invited via email.</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isInviting} className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm w-full">
              {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invite"}
            </Button>
          </div>
        </form>

        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or share invite link</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground text-center">Anyone with this link will be able to join the project directly.</p>
          <Button variant="outline" onClick={handleCopyLink} className="w-full gap-2 font-medium">
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
            {copied ? "Copied to Clipboard" : "Copy Project Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

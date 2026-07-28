"use client";

import { useState } from "react";
import { Plus, Loader2, Link as LinkIcon, CheckCircle2, Mail, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createOrganizationInvitation } from "@/app/actions/invitations";
import { toast } from "sonner";

interface InviteMemberModalProps {
  onInvitationSent?: () => void;
  trigger?: React.ReactNode;
}

export default function InviteMemberModal({ onInvitationSent, trigger }: InviteMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("Member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrganizationInvitation({ email: cleanEmail, roleName });
      if (res.success) {
        toast.success(res.message || "Invitation sent successfully!");
        setEmail("");
        setIsOpen(false);
        if (onInvitationSent) onInvitationSent();
      } else {
        toast.error(res.error || "Failed to send invitation.");
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
      // Use email if provided, or fallback to default placeholder email for shareable link
      const targetEmail = email.trim() || `invite-${Math.random().toString(36).substring(2, 7)}@guest.letsworktogether.lakshyniti.com`;
      const res = await createOrganizationInvitation({ email: targetEmail, roleName });
      
      if (res.success && res.inviteLink) {
        await navigator.clipboard.writeText(res.inviteLink);
        setCopiedLink(res.inviteLink);
        toast.success("Invite link copied to clipboard!");
        setTimeout(() => setCopiedLink(null), 3000);
        if (onInvitationSent) onInvitationSent();
      } else {
        toast.error(res.error || "Failed to generate invite link.");
      }
    } catch (err: any) {
      toast.error("Failed to copy link.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 border-0 bg-[image:var(--brand-gradient)] text-white shadow-md hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" /> Invite Member
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[460px] bg-card/95 backdrop-blur-xl border-border/60 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5 text-lwt-blue" />
            <DialogTitle className="text-xl font-bold">Invite Team Member</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Invite a collaborator to your organization. They will receive an email invitation or can join directly using the invite link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSendInvite} className="space-y-5 pt-3">
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
              placeholder="colleague@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" /> Member Role
            </label>
            <select
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-border/80 bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            >
              <option value="Member">Member - Standard team access</option>
              <option value="Admin">Admin - Full organization settings access</option>
              <option value="Viewer">Viewer - Read-only access</option>
            </select>
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
                <span className="bg-card px-2 text-muted-foreground font-medium">or copy link</span>
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
              ) : copiedLink ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <LinkIcon className="h-4 w-4 text-primary" />
              )}
              {copiedLink ? "Link Copied to Clipboard!" : "Copy Unique Invite Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

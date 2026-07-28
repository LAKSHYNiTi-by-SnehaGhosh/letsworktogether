"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Bot, Star, Activity, Mail, Loader2, Clock, RefreshCw, Link as LinkIcon, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTeamMembers } from "@/app/actions/team";
import { getOrganizationInvitations, revokeOrganizationInvitation, resendOrganizationInvitation } from "@/app/actions/invitations";
import InviteMemberModal from "@/components/dashboard/team/InviteMemberModal";
import { toast } from "sonner";

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersData, invitesData] = await Promise.all([
        getTeamMembers(),
        getOrganizationInvitations(),
      ]);
      setTeamMembers(membersData);
      setInvitations(invitesData);
    } catch (error) {
      console.error("Failed to load team data:", error);
      toast.error("Failed to load team members or invitations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRevoke = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await revokeOrganizationInvitation(id);
      if (res.success) {
        toast.success("Invitation revoked.");
        setInvitations((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "REVOKED" } : inv)));
      } else {
        toast.error(res.error || "Failed to revoke invitation.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResend = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await resendOrganizationInvitation(id);
      if (res.success) {
        toast.success(res.message || "Invitation resent!");
        loadData();
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Team</h1>
          <p className="text-muted-foreground mt-1">Manage your AI workforce and human collaborators.</p>
        </div>
        <InviteMemberModal onInvitationSent={loadData} />
      </div>

      {/* Active Team Members Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Active Members ({teamMembers.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${member.isAi ? "bg-primary" : "bg-emerald-500"}`} />

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      member.isAi
                        ? "bg-primary/20 text-primary"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {member.isAi ? <Bot className="h-6 w-6" /> : <Users className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Status
                  </span>
                  <span className="font-medium text-emerald-500">{member.status}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Bot className="h-4 w-4" /> Tasks Completed
                  </span>
                  <span className="font-medium">{member.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400" /> Rating
                  </span>
                  <span className="font-medium">{member.rating} / 5.0</span>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 mt-auto">
                <Mail className="h-4 w-4" /> Message
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pending / Managed Invitations Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" /> Invitations ({invitations.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={loadData} className="gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        {invitations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
            <Mail className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No invitations sent yet.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Use the Invite Member button above to add new collaborators.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40 border-b border-border/60 text-muted-foreground text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-3.5">Recipient</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Sent Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <AnimatePresence mode="popLayout">
                    {invitations.map((inv) => (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-foreground">
                          {inv.email}
                          {inv.invitedByName && (
                            <span className="block text-xs text-muted-foreground font-normal">
                              Invited by {inv.invitedByName}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {inv.roleName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {inv.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Clock className="h-3 w-3" /> Pending
                            </span>
                          )}
                          {inv.status === "ACCEPTED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Accepted
                            </span>
                          )}
                          {inv.status === "EXPIRED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
                              Expired
                            </span>
                          )}
                          {inv.status === "REVOKED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                              Revoked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {new Date(inv.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {inv.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyLink(inv.token)}
                                  className="h-8 px-2 text-xs gap-1"
                                  title="Copy Invite Link"
                                >
                                  {copiedToken === inv.token ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                  ) : (
                                    <LinkIcon className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResend(inv.id)}
                                  disabled={actionLoadingId === inv.id}
                                  className="h-8 px-2 text-xs gap-1"
                                  title="Resend Invitation Email"
                                >
                                  {actionLoadingId === inv.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <RefreshCw className="h-3.5 w-3.5 text-primary" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevoke(inv.id)}
                                  disabled={actionLoadingId === inv.id}
                                  className="h-8 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                                  title="Revoke Invitation"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}

                            {inv.status === "EXPIRED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResend(inv.id)}
                                disabled={actionLoadingId === inv.id}
                                className="h-8 text-xs gap-1"
                              >
                                <RefreshCw className="h-3.5 w-3.5" /> Renew & Resend
                              </Button>
                            )}
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
    </div>
  );
}

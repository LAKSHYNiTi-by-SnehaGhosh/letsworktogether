"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getInvitationDetails,
  acceptOrganizationInvitation,
  declineOrganizationInvitation,
} from "@/app/actions/invitations";
import { toast } from "sonner";

interface InvitationData {
  id: string;
  token: string;
  email: string;
  roleName: string;
  status: string;
  expiresAt: string | Date;
  organizationName: string;
  organizationSlug: string;
  inviterName: string;
}

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { redirectToSignUp, redirectToSignIn } = useClerk();

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAcceptedSuccess, setIsAcceptedSuccess] = useState(false);

  useEffect(() => {
    async function fetchInvitation() {
      setLoading(true);
      try {
        const res = await getInvitationDetails(token);
        if (res.success && res.invitation) {
          setInvitation(res.invitation as InvitationData);
        } else {
          setStatusError(res.error || "INVALID");
          setErrorMessage(res.message || "Invalid or expired invitation.");
          if (res.invitation) {
            setInvitation(res.invitation as InvitationData);
          }
        }
      } catch (err) {
        setStatusError("SERVER_ERROR");
        setErrorMessage("Failed to load invitation details.");
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [token]);

  const handleAccept = async () => {
    if (!isSignedIn) {
      // Save current invitation path for post-auth return
      const currentUrl = `/invite/${token}`;
      toast.info("Please sign up or sign in to accept your team invitation.");
      window.location.href = `/sign-up?redirect_url=${encodeURIComponent(currentUrl)}`;
      return;
    }

    setIsProcessing(true);
    try {
      const res = await acceptOrganizationInvitation(token);
      if (res.success) {
        setIsAcceptedSuccess(true);
        toast.success(res.message || "Invitation accepted!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error(res.error || "Failed to accept invitation.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      const res = await declineOrganizationInvitation(token);
      if (res.success) {
        toast.info("Invitation declined.");
        setStatusError("INVITATION_REVOKED");
        setErrorMessage("You have declined this invitation.");
      } else {
        toast.error(res.error || "Failed to decline invitation.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Validating team invitation...</p>
        </motion.div>
      </div>
    );
  }

  // Accepted Success Screen
  if (isAcceptedSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome Aboard! 🎉</h2>
            <p className="text-muted-foreground text-sm">
              You are now a member of <strong className="text-foreground">{invitation?.organizationName}</strong>.
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-[image:var(--brand-gradient)] text-white gap-2 py-6 font-medium shadow-md"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error States (Expired, Revoked, Invalid)
  if (statusError && statusError !== "INVITATION_ACCEPTED") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-8 text-center shadow-2xl space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
            {statusError === "INVITATION_EXPIRED" && (
              <div className="bg-amber-500/10 text-amber-500 p-4 rounded-full">
                <Clock className="h-8 w-8" />
              </div>
            )}
            {statusError === "INVITATION_REVOKED" && (
              <div className="bg-rose-500/10 text-rose-500 p-4 rounded-full">
                <XCircle className="h-8 w-8" />
              </div>
            )}
            {(statusError === "INVITATION_NOT_FOUND" || statusError === "INVALID_TOKEN" || statusError === "SERVER_ERROR") && (
              <div className="bg-rose-500/10 text-rose-500 p-4 rounded-full">
                <AlertTriangle className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {statusError === "INVITATION_EXPIRED" && "Invitation Expired"}
              {statusError === "INVITATION_REVOKED" && "Invitation Revoked"}
              {statusError !== "INVITATION_EXPIRED" && statusError !== "INVITATION_REVOKED" && "Invalid Invitation"}
            </h2>
            <p className="text-muted-foreground text-sm">{errorMessage}</p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              onClick={() => router.push(isSignedIn ? "/dashboard" : "/")}
              className="w-full bg-secondary hover:bg-secondary/80 text-foreground py-5 font-medium"
            >
              {isSignedIn ? "Back to Dashboard" : "Return to Home"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Already Accepted State
  if (statusError === "INVITATION_ACCEPTED" || invitation?.status === "ACCEPTED") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-8 text-center shadow-2xl space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Already Accepted</h2>
            <p className="text-muted-foreground text-sm">
              This invitation to join <strong className="text-foreground">{invitation?.organizationName}</strong> has already been accepted.
            </p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[image:var(--brand-gradient)] text-white gap-2 py-5 font-medium shadow-md"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // Active Pending Invitation Screen
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-card/95 backdrop-blur-xl border border-border/70 rounded-2xl p-8 shadow-2xl space-y-8 relative z-10"
      >
        {/* Brand Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Let's Work Together
          </div>
        </div>

        {/* Heading & Inviter Details */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            You're Invited!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            <strong className="text-foreground">{invitation?.inviterName}</strong> has invited you to collaborate in their organization on Let's Work Together.
          </p>
        </div>

        {/* Organization Card */}
        <div className="rounded-xl border border-border/60 bg-secondary/30 p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[image:var(--brand-gradient)] flex items-center justify-center text-white font-bold text-lg shadow-md">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{invitation?.organizationName}</h3>
              <p className="text-xs text-muted-foreground">slug: {invitation?.organizationSlug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Role:
              <span className="font-semibold text-foreground">{invitation?.roleName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-emerald-500" /> Invited Email:
              <span className="font-semibold text-foreground truncate max-w-[120px]">{invitation?.email}</span>
            </div>
          </div>
        </div>

        {/* Account Info Notice if logged in */}
        {isSignedIn && user && (
          <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/15 rounded-lg p-3 text-center">
            Signed in as <strong className="text-foreground">{user.primaryEmailAddress?.emailAddress}</strong>. Accept invitation to link your account.
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="w-full bg-[image:var(--brand-gradient)] text-white gap-2 py-6 font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Accepting Invitation...
              </>
            ) : (
              <>
                Accept Invitation <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleDecline}
            disabled={isProcessing}
            className="w-full text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            Decline Invitation
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

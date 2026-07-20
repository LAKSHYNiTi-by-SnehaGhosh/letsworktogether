"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getInvitationDetails, acceptProjectInvitation, rejectProjectInvitation } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { motion } from "framer-motion";

function InviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No invitation token found in the link.");
      setLoading(false);
      return;
    }

    getInvitationDetails(token)
      .then((data) => {
        if (!data || data.status !== "PENDING") {
          setError("This invitation is invalid, has already been accepted, or expired.");
        } else {
          setInvite(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load invitation details.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setIsProcessing(true);
    const result = await acceptProjectInvitation(token);
    setIsProcessing(false);

    if (result.success) {
      router.push(`/dashboard/projects/${result.projectId}`);
    } else {
      setError(result.error || "Failed to accept invitation.");
    }
  };

  const handleReject = async () => {
    if (!token) return;
    setIsProcessing(true);
    const result = await rejectProjectInvitation(token);
    setIsProcessing(false);

    if (result.success) {
      router.push("/dashboard/projects");
    } else {
      setError(result.error || "Failed to reject invitation.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto h-full flex flex-col items-center justify-center text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
          <X className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Invitation Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push("/dashboard/projects")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto h-full flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border shadow-sm rounded-xl p-8 w-full"
      >
        <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8" />
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight mb-2">You've been invited!</h2>
        <p className="text-muted-foreground mb-6">
          You have been invited to join the project <strong className="text-foreground">{invite?.project?.name}</strong>.
        </p>
        
        <div className="flex gap-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            disabled={isProcessing}
            onClick={handleReject}
          >
            Decline
          </Button>
          <Button 
            className="flex-1 bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm"
            disabled={isProcessing}
            onClick={handleAccept}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept Invite"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectInvitePage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <InviteContent />
    </Suspense>
  );
}

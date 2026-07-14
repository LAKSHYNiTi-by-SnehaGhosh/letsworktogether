"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, Briefcase, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { completeOnboarding } from "@/app/actions/onboarding";
const roles = [
  { id: "student", name: "Student", icon: GraduationCap, description: "Learning and executing tasks to build a portfolio." },
  { id: "mentor", name: "Mentor", icon: Briefcase, description: "Reviewing code and guiding students in their careers." },
  { id: "team_member", name: "Team Member", icon: Users, description: "Collaborating actively on projects and sprints." },
  { id: "contributor", name: "Contributor", icon: Plus, description: "Making open-source or occasional project contributions." },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string | null>(null);
  
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [memberCount, setMemberCount] = useState<number>(1);
  
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();

  const handleNextStep = () => {
    if (role) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !projectName || !projectDescription || !userId) return;
    
    setIsJoining(true);
    
    try {
      const result = await completeOnboarding({
        role,
        projectName,
        projectDescription,
        memberCount
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setIsJoining(false);
        alert(result.error || "Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setIsJoining(false);
      alert("Failed to save data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight mb-2"
          >
            {step === 1 ? "Select Your Role" : "Tell us about your Project"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {step === 1 
              ? "How will you be using Let's Work Together?"
              : "What are you and your team building?"}
          </motion.p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    role === r.id 
                      ? "border-lwt-blue bg-lwt-blue/5 ring-1 ring-lwt-blue" 
                      : "border-border/50 bg-card hover:border-border hover:bg-accent/50"
                  }`}
                >
                  <r.icon className={`h-8 w-8 mb-4 ${role === r.id ? "text-lwt-blue" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold mb-1">{r.name}</h3>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleNextStep} disabled={!role} className="bg-lwt-blue hover:bg-lwt-blue-light text-white px-8">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Name</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Acme FinTech Platform" 
                  required
                  className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lwt-blue/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Description</label>
                <textarea 
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="What is the main goal of this project?" 
                  required
                  rows={4}
                  className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lwt-blue/50 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Number of Members</label>
                <input 
                  type="number" 
                  min="1"
                  value={memberCount}
                  onChange={(e) => setMemberCount(parseInt(e.target.value) || 1)}
                  required
                  className="w-full p-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-lwt-blue/50"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isJoining || !projectName || !projectDescription}
                  className="bg-lwt-blue hover:bg-lwt-blue-light text-white px-8"
                >
                  {isJoining ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving to Database...
                    </span>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>

            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}

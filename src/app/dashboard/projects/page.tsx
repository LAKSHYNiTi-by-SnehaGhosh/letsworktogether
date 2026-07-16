"use client";

import { useState, useEffect } from "react";
import { Plus, Bot, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createProject, joinProject } from "@/app/actions/projects";
import { getUserProjects } from "@/app/actions/queries";
import { generateSprintForProject } from "@/app/actions/ai";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProjectsPage() {
  const { user } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinProjectId, setJoinProjectId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiProjectId, setAiProjectId] = useState("");
  const [aiPrompt, setAiPrompt] = useState("Generate a 2-week sprint with 3 milestones for building the MVP.");

  useEffect(() => {
    if (!user) return;

    getUserProjects()
      .then((projs) => {
        setProjects(projs);
        if (projs.length > 0) setAiProjectId(projs[0].id);
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiProjectId || !aiPrompt) return;

    setIsGenerating(true);
    try {
      const result = await generateSprintForProject(aiProjectId, aiPrompt);
      if (result.success) {
        setIsAiDialogOpen(false);
        setAiPrompt("Generate a 2-week sprint with 3 milestones for building the MVP.");
        alert("Sprint generated successfully! Check your project board.");
        getUserProjects().then(setProjects);
      } else {
        alert(result.error || "Failed to generate sprint.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate sprint. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newProjectDesc || !user) return;
    
    setIsCreating(true);
    const result = await createProject({ name: newProjectName, description: newProjectDesc });
    setIsCreating(false);
    
    if (result.success) {
      setIsDialogOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      getUserProjects().then(setProjects);
    } else {
      alert("Failed to create project");
    }
  };

  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinProjectId || !user) return;
    
    setIsJoining(true);
    const result = await joinProject(joinProjectId);
    setIsJoining(false);
    
    if (result.success) {
      setIsJoinDialogOpen(false);
      setJoinProjectId("");
      getUserProjects().then(setProjects);
    } else {
      alert("Failed to join project. Check ID or permissions.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-lwt-blue" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your active projects and let the AI PM generate new sprints.</p>
        </div>
        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
          <DialogTrigger
            render={
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button disabled={isGenerating} className="gap-2 border-0 bg-[image:var(--brand-gradient)] text-white shadow-md hover:opacity-90">
                  {isGenerating ? <Clock className="h-4 w-4 animate-spin text-accent" /> : <Bot className="h-4 w-4 text-accent-foreground dark:text-accent" />}
                  {isGenerating ? "AI is Generating..." : "Generate Sprint with AI"}
                </Button>
              </motion.div>
            }
          />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>AI Project Manager</DialogTitle>
              <DialogDescription>
                Select a project and describe what you want the AI to plan for you.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGenerateAI} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <select 
                  required
                  value={aiProjectId}
                  onChange={(e) => setAiProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt</label>
                <textarea 
                  required
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="e.g. Generate a sprint for building the user authentication flow."
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isGenerating} className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm w-full">
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Now"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[image:var(--brand-gradient)]" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full">
                {project.status || "Planning"}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <UsersIcon className="h-3 w-3" /> {project._count?.members || 0} members
              </span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">{project.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${project.progress || 0}%` }} />
              </div>
            </div>

            <Link href={`/dashboard/projects/${project.id}`} className="w-full mt-auto">
              <Button variant="outline" className="w-full gap-2 group-hover:bg-primary/5 group-hover:border-primary/30">
                View Project <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            nativeButton={false}
            render={
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-dashed border-border/60 bg-transparent flex flex-col items-center justify-center p-6 text-center text-muted-foreground hover:bg-card/50 hover:text-foreground transition-colors cursor-pointer min-h-[300px]"
              />
            }
          >
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-1">Create Custom Project</h3>
            <p className="text-xs max-w-[200px]">Manually create a project instead of using the AI Project Manager.</p>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Define your project details here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <input 
                  autoFocus
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Acme Billing Dashboard"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="What are you building?"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isCreating} className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm w-full">
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
          <DialogTrigger
            nativeButton={false}
            render={
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-dashed border-border/60 bg-transparent flex flex-col items-center justify-center p-6 text-center text-muted-foreground hover:bg-card/50 hover:text-foreground transition-colors cursor-pointer min-h-[300px]"
              />
            }
          >
            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <UsersIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-1">Join Project</h3>
            <p className="text-xs max-w-[200px]">Join an existing project by its unique ID.</p>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join a Project</DialogTitle>
              <DialogDescription>
                Enter the Project ID to request access or join immediately.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoinProject} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project ID</label>
                <input 
                  autoFocus
                  required
                  value={joinProjectId}
                  onChange={(e) => setJoinProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isJoining} className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm w-full">
                  {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

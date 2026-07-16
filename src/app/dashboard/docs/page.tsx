"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Folder, BookOpen, Clock, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDocuments, createDocument } from "@/app/actions/docs";
import { getUserProjects } from "@/app/actions/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DocsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("PRD");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadData = () => {
    Promise.all([getDocuments(), getUserProjects()])
      .then(([fetchedDocs, fetchedProjects]) => {
        setDocs(fetchedDocs);
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(fetchedProjects[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !selectedProjectId) return;
    
    setIsCreating(true);
    try {
      await createDocument({
        projectId: selectedProjectId,
        title: newTitle,
        type: newType,
        content: ""
      });
      setIsDialogOpen(false);
      setNewTitle("");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to create document.");
    } finally {
      setIsCreating(false);
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
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-1">Access your PRDs, technical specs, and AI-generated documentation.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button className="gap-2 bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm hover:opacity-90">
                <Plus className="h-4 w-4" /> New Document
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
              <DialogDescription>
                Add a new PRD, Tech Spec, or Design doc to a project.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDoc} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <input 
                  autoFocus
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. V2 Architecture Spec"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select 
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="PRD">PRD</option>
                  <option value="Technical">Technical Spec</option>
                  <option value="Design">Design Doc</option>
                  <option value="General">General Note</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <select 
                  required
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isCreating} className="bg-[image:var(--brand-gradient)] border-0 text-white shadow-sm w-full">
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Document"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            No documents found. Create one to get started!
          </div>
        )}
        
        {docs.map((doc, i) => {
          const Icon = doc.type === 'PRD' ? BookOpen : doc.type === 'Technical' ? Folder : FileText;
          return (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border/50 bg-card p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
            {doc.project && <p className="text-xs text-muted-foreground mb-4">Project: {doc.project.name}</p>}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-6 pt-4 border-t border-border/40">
              <span className="font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">{doc.type}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(doc.updatedAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        )})}
      </div>
    </div>
  );
}

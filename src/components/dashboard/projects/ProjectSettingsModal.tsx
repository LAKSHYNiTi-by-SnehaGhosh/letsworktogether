"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, LogOut, Settings, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProjectStatus, deleteProject, leaveProject } from "@/app/actions/projects";

interface ProjectSettingsModalProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    userRole: string;
  } | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function ProjectSettingsModal({
  project,
  isOpen,
  onOpenChange,
  onUpdated,
}: ProjectSettingsModalProps) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [status, setStatus] = useState(project?.status || "ACTIVE");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  if (!project) return null;

  const isOwner = project.userRole === "OWNER";
  const canManage = isOwner || project.userRole === "ADMIN";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onOpenChange(false);
        onUpdated();
      } else {
        alert(data.error || "Failed to update project");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating project settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      const res = await deleteProject(project.id);
      if (res.success) {
        onOpenChange(false);
        onUpdated();
      } else {
        alert(res.error || "Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm(`Are you sure you want to leave "${project.name}"?`)) return;
    setIsLeaving(true);
    try {
      const res = await leaveProject(project.id);
      if (res.success) {
        onOpenChange(false);
        onUpdated();
      } else {
        alert(res.error || "Failed to leave project");
      }
    } catch (err) {
      console.error(err);
      alert("Error leaving project");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" /> Project Settings
          </DialogTitle>
          <DialogDescription>
            Update status, details, or manage membership for &quot;{project.name}&quot;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <input
              disabled={!canManage}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              disabled={!canManage}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Project Status</label>
            <select
              disabled={!canManage}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm disabled:opacity-60"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="ON_HOLD">ON HOLD</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          {canManage && (
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSaving} className="gap-2 bg-primary text-primary-foreground shadow-sm">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          )}
        </form>

        <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
          {!isOwner && (
            <Button
              variant="outline"
              size="sm"
              disabled={isLeaving}
              onClick={handleLeave}
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 gap-1.5"
            >
              {isLeaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Leave Project
            </Button>
          )}

          {isOwner && (
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDelete}
              className="gap-1.5 ml-auto"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

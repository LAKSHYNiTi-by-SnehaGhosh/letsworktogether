"use client";

import { useState, useEffect, useTransition } from "react";
import { getUserTasks, getUserProjects } from "@/app/actions/queries";
import { 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Edit3, 
  Search, 
  Filter, 
  CheckSquare, 
  Sparkles, 
  Calendar,
  Layers,
  Tag,
  AlertCircle
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { 
  createTask, 
  updateTask, 
  toggleTaskCompletion, 
  deleteTask, 
  clearCompletedTasks 
} from "@/actions/task-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyTasksPage() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Filters & Search
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newProjectId, setNewProjectId] = useState("");

  // Edit Modal State
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editStatus, setEditStatus] = useState("TODO");
  const [editProjectId, setEditProjectId] = useState("");

  const loadData = () => {
    if (!user) return;
    Promise.all([getUserTasks(), getUserProjects()])
      .then(([tData, pData]) => {
        setTasks(tData || []);
        setProjects(pData || []);
        if (pData && pData.length > 0 && !newProjectId) {
          setNewProjectId(pData[0].id);
        }
      })
      .catch((err) => console.error("Error loading task data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    startTransition(async () => {
      try {
        await createTask({
          title: newTitle,
          description: newDesc,
          priority: newPriority,
          projectId: newProjectId,
        });
        setNewTitle("");
        setNewDesc("");
        setNewPriority("MEDIUM");
        setIsCreateOpen(false);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to create task");
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    startTransition(async () => {
      try {
        await updateTask(editingTask.id, {
          title: editTitle,
          description: editDesc,
          priority: editPriority,
          status: editStatus,
          projectId: editProjectId,
        });
        setEditingTask(null);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to update task");
      }
    });
  };

  const handleToggle = (taskId: string, isCompleted: boolean) => {
    startTransition(async () => {
      await toggleTaskCompletion(taskId, isCompleted);
      loadData();
    });
  };

  const handleDelete = (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    startTransition(async () => {
      await deleteTask(taskId);
      loadData();
    });
  };

  const handleClearCompleted = () => {
    if (!confirm("Clear all completed tasks?")) return;
    startTransition(async () => {
      await clearCompletedTasks();
      loadData();
    });
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setEditTitle(task.title || "");
    setEditDesc(task.description || "");
    setEditPriority(task.priority || "MEDIUM");
    setEditStatus(task.status || "TODO");
    setEditProjectId(task.projectId || "");
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    // Tab Filter
    if (tabFilter === "active" && t.status === "DONE") return false;
    if (tabFilter === "completed" && t.status !== "DONE") return false;

    // Priority Filter
    if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;

    // Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const titleMatch = t.title?.toLowerCase().includes(q);
      const descMatch = t.description?.toLowerCase().includes(q);
      const projMatch = t.project?.name?.toLowerCase().includes(q);
      return titleMatch || descMatch || projMatch;
    }

    return true;
  });

  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const activeCount = tasks.length - completedCount;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading To-Do list...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-full flex flex-col space-y-6 overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
            <CheckSquare className="h-8 w-8 text-primary" /> To-Do List & Tasks
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Organize personal goals, topics, and project tasks assigned by you or your AI Manager.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {completedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCompleted}
              disabled={isPending}
              className="text-xs text-muted-foreground hover:text-red-500 border-border/80"
            >
              Clear Completed ({completedCount})
            </Button>
          )}
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-primary text-primary-foreground shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add New Task / Topic
          </Button>
        </div>
      </div>

      {/* Progress & Stat Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card p-5 rounded-2xl border border-border/60 shadow-xs">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Tasks</span>
          <div className="text-2xl font-bold text-foreground">{tasks.length}</div>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Pending</span>
          <div className="text-2xl font-bold text-amber-500">{activeCount}</div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Completed</span>
            <span className="text-emerald-500">{progressPercent}%</span>
          </div>
          <div className="text-2xl font-bold text-emerald-500 mb-1">{completedCount}</div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Tabs & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border/60">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by task title, topic, or project..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-muted rounded-lg border border-border/40 text-xs font-medium">
            <button
              onClick={() => setTabFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                tabFilter === "all" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setTabFilter("active")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                tabFilter === "active" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setTabFilter("completed")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                tabFilter === "completed" ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Items */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === "DONE";

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                isDone
                  ? "bg-card/40 border-border/40 opacity-75"
                  : "bg-card border-border/70 hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Checkbox Toggle */}
                <button
                  onClick={() => handleToggle(task.id, !isDone)}
                  disabled={isPending}
                  className="mt-0.5 shrink-0 transition-transform active:scale-95"
                  title={isDone ? "Mark as TODO" : "Mark as Complete"}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-base font-semibold transition-all ${
                        isDone
                          ? "line-through decoration-muted-foreground/60 text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        task.priority === "URGENT"
                          ? "bg-red-500/10 text-red-600 border-red-500/20"
                          : task.priority === "HIGH"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          : task.priority === "MEDIUM"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Project / Topic Badge */}
                    {task.project && (
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-muted text-muted-foreground rounded-md flex items-center gap-1 border border-border/40">
                        <Tag className="h-3 w-3" /> {task.project.name}
                      </span>
                    )}
                  </div>

                  {/* Task Topic / Description */}
                  {task.description && (
                    <p
                      className={`text-xs ${
                        isDone ? "text-muted-foreground/60 line-through" : "text-muted-foreground"
                      } line-clamp-2`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Due Date & Timestamps */}
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 pt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end md:self-center opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(task)}
                  disabled={isPending}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="Edit Task"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  disabled={isPending}
                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center p-12 border border-dashed border-border/70 rounded-2xl bg-card/30 space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-foreground text-lg">No tasks found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {search || priorityFilter !== "ALL" || tabFilter !== "all"
                ? "No tasks match your current search or filter rules."
                : "Your to-do list is empty. Add a new task or ask your AI Manager to generate tasks for you!"}
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              size="sm"
              className="gap-2 bg-primary text-primary-foreground mt-2"
            >
              <Plus className="h-4 w-4" /> Add Task Now
            </Button>
          </div>
        )}
      </div>

      {/* Modal: Create Task */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add New Task / Topic
            </DialogTitle>
            <DialogDescription>
              Create a task with title, topic details, priority, and project association.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title *</label>
              <input
                autoFocus
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Design homepage hero banner"
                className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic / Description / Notes</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Add specific topics, requirements, or instructions..."
                className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Workspace</label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  {projects.length === 0 && <option value="">Default Personal Tasks</option>}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" disabled={isPending || !newTitle.trim()} className="bg-primary text-primary-foreground w-full">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Task */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" /> Edit Task / Topic
            </DialogTitle>
            <DialogDescription>
              Update task details, completion status, or priority.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title *</label>
              <input
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic / Description</label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <select
                  value={editProjectId}
                  onChange={(e) => setEditProjectId(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" disabled={isPending || !editTitle.trim()} className="bg-primary text-primary-foreground w-full">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
